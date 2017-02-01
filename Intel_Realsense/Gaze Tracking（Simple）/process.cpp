#include "process.h"
#include <windows.h>
#include <WindowsX.h>
#include <commctrl.h>
#include <io.h>
#include <map>
#include "math.h"
#include "resource.h"
#include "pxcfacemodule.h"
#include "pxcfacedata.h"
#include "pxcvideomodule.h"
#include "pxcfaceconfiguration.h"
#include "pxcmetadata.h"
#include "service/pxcsessionservice.h"
#include <pxcsensemanager.h>  
#include <pxcsession.h>
#include <utilities\pxcsmoother.h>
#include "util_render.h" 
#include <iostream>
#include <stdio.h> 
#include <opencv2/opencv.hpp>  
#include <string.h>

#define OUT_OF_SCREEN 2000

using namespace cv;
using namespace std;
class FuncSwitch //��������ԭ���жϹ��ܿ���
{
public:
	int maxthreshold = 99;
	int minthreshold = 1;
	int COUNTMAX = 15;
	bool FuncON = false;
	bool flag = 0;
	int count = 0;
	void Switcher(pxcI32 intensity)
	{
		if (intensity > maxthreshold)
		{
			count++;
			//cout << count << endl;
			if (count > COUNTMAX)
				flag = 1;
		}
		else
		{
			if (flag == 1 && intensity< minthreshold)
			{
				FuncON = true;
				flag = 0;
			}
			count = 0;
		}
	};
};
void DrawRectangle(Mat &img, Rect box)
{
	rectangle(img, box, Scalar(255, 255, 0), 2);
}

PXCSession* session = NULL;
extern volatile bool need_calibration;
extern volatile bool gazetracking;
extern volatile bool expression;
extern volatile bool showimage;
extern volatile bool cursorcontrol;
extern volatile bool changepage;
extern volatile bool teminateprocessing;

int eye_point_x = 2000;
int eye_point_y = 2000;

int cursor_pos_x = 0;
int cursor_pos_y = 0;

typedef DWORD(WINAPI *make_layered)(HWND, DWORD, BYTE, DWORD);
static make_layered set_layered_window = NULL;
static BOOL dll_initialized = FALSE;
short calibBuffersize = 0;
unsigned char* calibBuffer = NULL;
int calib_status = 0;
int dominant_eye = 0;

HANDLE ghMutex = NULL;
HWND ghWnd = NULL; //HWND���ھ��
HWND ghWndEyeBack = NULL;
HWND ghWndEyePoint = NULL;
HINSTANCE ghInstance = NULL;

cv::Scalar c = cv::Scalar(0, 255, 0);

LRESULT CALLBACK WndProc(HWND hWnd, UINT message, WPARAM wParam, LPARAM lParam) //ע����˿��ƴ�����������д���
{

	switch (message)
	{

	case WM_KEYDOWN: // exit calibration

		switch (wParam)
		{

		case VK_ESCAPE:
			PostMessage(ghWnd, WM_COMMAND, ID_STOP, 0);
			CloseWindow(hWnd);
			break;

		}

	}

	// default message handling
	if (message) return DefWindowProc(hWnd, message, wParam, lParam);
	else return 0;
}

ATOM MyRegisterClass(HINSTANCE hInstance, DWORD color, WCHAR* name)//ע�ᴰ��
{

	WNDCLASSEX wcex;

	wcex.cbSize = sizeof(WNDCLASSEX);
	wcex.style = CS_HREDRAW | CS_VREDRAW;
	wcex.lpfnWndProc = WndProc;
	wcex.cbClsExtra = 0;
	wcex.cbWndExtra = 0;
	wcex.hInstance = hInstance;
	wcex.hIcon = NULL;
	wcex.hCursor = LoadCursor(NULL, IDC_ARROW);
	wcex.hbrBackground = (HBRUSH)CreateSolidBrush(color);
	wcex.lpszMenuName = NULL;
	wcex.lpszClassName = name;
	wcex.hIconSm = NULL;
	return RegisterClassEx(&wcex);

}
bool InitSimpleWindow(HWND* hwnd, int size, DWORD color, WCHAR* name)//У׼�ĺ��
{

	if (hwnd == NULL) return false;

	// create transparent eye point window

	if (*hwnd == NULL) {

		MyRegisterClass(ghInstance, color, name);

		*hwnd = CreateWindow(name, name, WS_POPUP,
			-500, -500, size, size, ghWndEyeBack, NULL, ghInstance, NULL);
		if (!hwnd) return false;

	}

	ShowWindow(*hwnd, SW_SHOW);
	UpdateWindow(*hwnd);

	return true;

}
bool make_transparent(HWND hWnd) //ʹ����͸��
{

	if (!dll_initialized) {

		HMODULE hLib = LoadLibraryA("user32");
		set_layered_window = (make_layered)GetProcAddress(hLib, "SetLayeredWindowAttributes");
		dll_initialized = TRUE;

	}

	if (set_layered_window == NULL) return FALSE;
	SetLastError(0);

	SetWindowLong(hWnd, GWL_EXSTYLE, GetWindowLong(hWnd, GWL_EXSTYLE) | WS_EX_LAYERED);
	if (GetLastError()) return FALSE;

	return set_layered_window(hWnd, RGB(0, 0, 0), 127, LWA_COLORKEY | LWA_ALPHA) != NULL;

}
bool InitTransWindow(HWND* hwnd, int size, DWORD color, WCHAR* name) //��ʾ���߸��ٵ�Ĵ���
{

	if (hwnd == NULL) return false;

	// create transparent eye point window

	if (*hwnd == NULL) {

		MyRegisterClass(ghInstance, color, name);

		*hwnd = CreateWindow(name, name, WS_POPUP,
			0, 0, size, size, ghWndEyeBack, NULL, ghInstance, NULL);

		if (!hwnd) return false;

	}

	make_transparent(*hwnd);
	ShowWindow(*hwnd, SW_SHOW);
	UpdateWindow(*hwnd);

	return true;

}



bool InitBackWindow(HWND* hwnd, DWORD color, WCHAR* name) //У׼ʱ�ı�������
{

	if (hwnd == NULL) return false;

	// create transparent eye point window

	if (*hwnd == NULL) {

		MyRegisterClass(ghInstance, color, name);

		RECT rc;
		const HWND hDesktop = GetDesktopWindow();
		GetWindowRect(hDesktop, &rc);//�˺����������������ֱֵ�Ӵ���

		*hwnd = CreateWindow(name, name, WS_POPUP,
			0, 0, 1920, 1280, ghWnd, NULL, ghInstance, NULL);

		if (!hwnd)
		{
			MessageBox(NULL, L"CreateWnd Failed", L"Error", MB_OK);
			return false;
		}

	}

	// hide back window at first enable when API loaded

	ShowWindow(*hwnd, SW_SHOW);
	UpdateWindow(*hwnd);

	return true;

}

void CloseTransWindow(HWND* hwnd) {

	// close EyePoint window

	if (*hwnd) {

		DestroyWindow(*hwnd);
		*hwnd = NULL;
	}
}

void CloseCalibWindows() {

	// close calibration windows

	CloseTransWindow(&ghWndEyeBack);
	CloseTransWindow(&ghWndEyePoint);

}

void EnableBackWindow() //У׼��ʼǰ������ʾ��
{

	// show message box as latest point

	MessageBoxA(ghWnd, "У׼ǰ����ƽ��״̬�½�ͷ����׼����ͷ����У׼�����ֺ��׼���", "��ҪУ׼", MB_OK | MB_ICONINFORMATION);

	// enable back window

	//ShowWindow(ghWndEyeBack, SW_SHOW);
	//UpdateWindow(ghWndEyeBack);

}

bool Timer()
{
	static int count;
	if (count++ > 30)
	{
		count = 0;
		return true;
	}
	return false;
}
void UpdateTracking() //��������׷�ٴ��ڵ�λ��
{

	// set position of gaze point

	if (ghWndEyePoint)
	{
		RECT rc;
		GetWindowRect(ghWndEyePoint, &rc);
		int width = rc.right - rc.left;
		int height = rc.bottom - rc.top;
		POINT curpoint;
		SetWindowPos(ghWndEyePoint, NULL, eye_point_x - width / 2, eye_point_y - height / 2, width, height, NULL);
		if (cursorcontrol == true && Timer())
		{
			GetCursorPos(&curpoint);
			if ((abs(eye_point_x - curpoint.x)) > 300 && (abs(eye_point_y - curpoint.y)) > 300)
			{
				SetCursorPos(eye_point_x, eye_point_y);
			}
		}
	}
}

extern int processing() {
	CvPoint lefteye, righteye; //���ڱ�������������������
							   //���������������ı��ۼ��
	FuncSwitch LeftEyeClose;
	FuncSwitch RightEyeClose;
	FuncSwitch EyeTurnLeft;
	FuncSwitch EyeTurnRight;
	FuncSwitch Smile;
	FuncSwitch MouthOpen;
	FuncSwitch TongueOut;
	//��ʾ��Ƶ��
	PXCSenseManager *psm = 0;
	psm = PXCSenseManager::CreateInstance();
	psm->EnableStream(PXCCapture::STREAM_TYPE_COLOR, 640, 480);

	// Creating PXCSmoother instance
	PXCSmoother* smootherFactory;
	psm->QuerySession()->CreateImpl<PXCSmoother>(&smootherFactory);
	//PXCSmoother::Smoother2D* smoother2D = smootherFactory->Create2DSpring(1.0f);
	PXCSmoother::Smoother2D* smoother2D = smootherFactory->Create2DQuadratic(1.0f);
	pxcI32 nweights = 10;
	pxcF32 weights[10] = { 0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1,0.1 };
	//PXCSmoother::Smoother2D* smoother2D = smootherFactory->Create2DWeighted(nweights,weights);*/
	//PXCSmoother::Smoother2D* smoother2D = smootherFactory->Create2DStabilizer(1.0f,50);

	if (!psm)
	{
		wprintf_s(L"Unabel to create the PXCSenseManager/n");
		return 1;
	}
	//ʹ����������	
	psm->EnableFace();
	// ��ʼ���ܵ�ʹ��frame looping procedure	
	psm->Init();
	//�õ�һ������ģ���ʵ��	
	PXCFaceModule *faceModule = psm->QueryFace();
	if (faceModule == NULL)
	{
		wprintf_s(L"Unabel to query FaceModule/n");
		return 3;
	}	//����һ������׷��ģ�鶯̬���õ�ʵ��	
	PXCFaceConfiguration *cfg = faceModule->CreateActiveConfiguration();
	//����ʶ��ʹ��
	PXCFaceConfiguration::ExpressionsConfiguration *expc = cfg->QueryExpressions();
	expc->Enable();
	expc->EnableAllExpressions();
	PXCFaceConfiguration::GazeConfiguration *gazec = cfg->QueryGaze();
	gazec->isEnabled = true;

	// ʹ�����о���
	cfg->EnableAllAlerts();
	//���Ҳ��ע�͵�����Ӱ������							
	if (cfg == NULL)
	{
		wprintf_s(L"Unable to create FaceConfiguration/n");
		return 4;
	}	cfg->detection.isEnabled = TRUE;
	//���ö�ά��άͼ��ͬʶ��
	cfg->SetTrackingMode(PXCFaceConfiguration::FACE_MODE_COLOR_PLUS_DEPTH);
	//���κβ����ĸı䷴����faceModule
	cfg->QueryPulse()->Enable();
	cfg->ApplyChanges();
	//�����������ݵ�ʵ��	
	PXCFaceData *facedata = faceModule->CreateOutput();
	//��ʾ��ɫͼ��
	PXCImage *colorIm;
	PXCImage::ImageData color_data;
	PXCImage::ImageInfo color_info;
	while (psm->AcquireFrame(true) >= PXC_STATUS_NO_ERROR)
	{
		if (psm->AcquireFrame(true) < PXC_STATUS_NO_ERROR) break;
		//��ȡ���µ�����׷�����ò���
		facedata->Update();
		PXCCapture::Sample *sample = psm->QuerySample();
		colorIm = sample->color;
		if (colorIm->AcquireAccess(PXCImage::ACCESS_READ, PXCImage::PIXEL_FORMAT_RGB24, &color_data) < PXC_STATUS_NO_ERROR)
			wprintf_s(L"δ������ȡ��ɫͼ/n");
		color_info = sample->color->QueryInfo();
		pxcI32 leyeclosed = 0;
		pxcI32 reyeclosed = 0;
		Mat color(Size(color_info.width, color_info.height), CV_8UC3, (void*)color_data.planes[0], color_data.pitches[0] / sizeof(uchar));
		//ȡ����⵽��������Ŀ		
		pxcI32 nfaces = facedata->QueryNumberOfDetectedFaces();
		//����Ұ��ÿһ������׷�ٴ���
		PXCFaceData::Face *trackedface = facedata->QueryFaceByIndex(0);

		if (trackedface)
		{
			PXCFaceData::DetectionData *detectiondata = trackedface->QueryDetection();
			if (gazetracking)
			{
				if (need_calibration)
				{
					// faced is the GazeCalibData instance
					//PXCPointI32 calibp = {};
					PXCFaceData::GazeCalibData::CalibrationState state = trackedface->QueryGazeCalibration()->QueryCalibrationState();
					switch (state)
					{
					case PXCFaceData::GazeCalibData::CALIBRATION_IDLE:
						// Visual clue to the user that the calibration process starts, or LoadCalibData.
						eye_point_x = OUT_OF_SCREEN;
						eye_point_y = OUT_OF_SCREEN;
						SetCursorPos(OUT_OF_SCREEN, OUT_OF_SCREEN);
						cout << "The calibration process starts!" << endl;
						EnableBackWindow();
						InitBackWindow(&ghWndEyeBack, RGB(0, 0, 0), L"Background");
						InitSimpleWindow(&ghWndEyePoint, 35, RGB(255, 0, 0), L"EyePoint1");  // 35-50
						break;
					case PXCFaceData::GazeCalibData::CALIBRATION_NEW_POINT:
						// Visual cue to the user that a new calibration point is available.
						PXCPointI32 new_point = trackedface->QueryGazeCalibration()->QueryCalibPoint();
						// set the cursor to that point
						cout << "Calibrate new points!" << endl;
						eye_point_x = new_point.x;
						eye_point_y = new_point.y;
						UpdateTracking();
						SetCursorPos(OUT_OF_SCREEN, OUT_OF_SCREEN);
						break;
					case PXCFaceData::GazeCalibData::CALIBRATION_SAME_POINT:
						// Continue visual cue to the user at the same location.
						//cout << "Calibrate the same point!" << endl;
						break;
					case PXCFaceData::GazeCalibData::CALIBRATION_DONE:
						// Visual cue to the user that the calibration process is complete or calibration data is loaded.
						// Optionally save the calibration data.
						cout << "Calibration done!" << endl;
						calibBuffersize = trackedface->QueryGazeCalibration()->QueryCalibDataSize();
						if (calibBuffer == NULL) calibBuffer = new unsigned char[calibBuffersize];
						calib_status = trackedface->QueryGazeCalibration()->QueryCalibData(calibBuffer);
						dominant_eye = trackedface->QueryGazeCalibration()->QueryCalibDominantEye();
						need_calibration = false;
						CloseCalibWindows();
						InitTransWindow(&ghWndEyePoint, 100, RGB(255, 255, 0), L"EyePoint2");
						break;
					}
				}
				if (!need_calibration)
				{
					PXCFaceData::GazeData *gazed = trackedface->QueryGaze();
					if (gazed)
					{
						PXCFaceData::GazePoint gazep = gazed->QueryGazePoint();
						PXCPointF32 GazePoint;
						GazePoint.x = gazep.screenPoint.x;
						GazePoint.y = gazep.screenPoint.y;
						PXCPointF32 smoothed2DPoint = smoother2D->SmoothValue(GazePoint);
						eye_point_x = smoothed2DPoint.x;//floatתint ��Ϣ��ʧ��
						eye_point_y = smoothed2DPoint.y;
						//SetCursorPos(eye_point_x, eye_point_y);
						UpdateTracking();
						//SetCursorPos(gazep.screenPoint.x, gazep.screenPoint.y);
					}
				}
			}

			PXCFaceData::LandmarksData *ldata = trackedface->QueryLandmarks();
			PXCFaceData::ExpressionsData *lefteyeedata = trackedface->QueryExpressions();
			PXCFaceData::ExpressionsData *righteyeedata = trackedface->QueryExpressions();
			PXCFaceData::ExpressionsData *eyeturnleftedata = trackedface->QueryExpressions();
			PXCFaceData::ExpressionsData *eyeturnrightedata = trackedface->QueryExpressions();
			PXCFaceData::ExpressionsData *smiledata = trackedface->QueryExpressions();
			PXCFaceData::ExpressionsData *mouthopendata = trackedface->QueryExpressions();
			PXCFaceData::ExpressionsData *tongueoutdata = trackedface->QueryExpressions();
			PXCFaceData::ExpressionsData::FaceExpressionResult lefteyescore, righteyescore, eyeturnleftscore, eyeturnrightscore, smilescore, mouthopenscore, tongueoutscore;
			lefteyeedata->QueryExpression(PXCFaceData::ExpressionsData::EXPRESSION_EYES_CLOSED_LEFT, &lefteyescore);
			righteyeedata->QueryExpression(PXCFaceData::ExpressionsData::EXPRESSION_EYES_CLOSED_RIGHT, &righteyescore);
			eyeturnleftedata->QueryExpression(PXCFaceData::ExpressionsData::EXPRESSION_EYES_TURN_LEFT, &eyeturnleftscore);
			eyeturnrightedata->QueryExpression(PXCFaceData::ExpressionsData::EXPRESSION_EYES_TURN_RIGHT, &eyeturnrightscore);
			smiledata->QueryExpression(PXCFaceData::ExpressionsData::EXPRESSION_SMILE, &smilescore);
			mouthopendata->QueryExpression(PXCFaceData::ExpressionsData::EXPRESSION_MOUTH_OPEN, &mouthopenscore);
			tongueoutdata->QueryExpression(PXCFaceData::ExpressionsData::EXPRESSION_TONGUE_OUT, &tongueoutscore);
			if (expression)
			{
				LeftEyeClose.Switcher(lefteyescore.intensity);
				RightEyeClose.Switcher(righteyescore.intensity);
				EyeTurnLeft.Switcher(eyeturnleftscore.intensity);
				EyeTurnRight.Switcher(eyeturnrightscore.intensity);//���±�д�������
				if (LeftEyeClose.FuncON)
				{
					if (changepage)
					{
						keybd_event(VK_PRIOR, 0, 0, 0);
						keybd_event(VK_PRIOR, 0, KEYEVENTF_KEYUP, 0);
					}
					cout << "���۱�" << endl;
					LeftEyeClose.FuncON = false;
				}
				if (RightEyeClose.FuncON)
				{
					if (changepage)
					{
						keybd_event(VK_NEXT, 0, 0, 0);
						keybd_event(VK_NEXT, 0, KEYEVENTF_KEYUP, 0);
					}
					cout << "���۱�" << endl;
					RightEyeClose.FuncON = false;
				}
				if (EyeTurnLeft.FuncON)
				{
					if (changepage)
					{
						keybd_event(VK_PRIOR, 0, 0, 0);
						keybd_event(VK_PRIOR, 0, KEYEVENTF_KEYUP, 0);
					}
					cout << "����" << endl;
					EyeTurnLeft.FuncON = false;
				}

				if (EyeTurnRight.FuncON)
				{
					if (changepage)
					{
						keybd_event(VK_NEXT, 0, 0, 0);
						keybd_event(VK_NEXT, 0, KEYEVENTF_KEYUP, 0);
					}
					cout << "���ҿ�" << endl;
					EyeTurnRight.FuncON = false;
				}

			}
			PXCFaceData::PulseData *pdata = trackedface->QueryPulse();
			pxcF32 heartrate = pdata->QueryHeartRate();
			//���������
			pxcI32 npoints = ldata->QueryNumPoints();// allocate the array big enough to hold the landmark points.
			PXCFaceData::LandmarkPoint *points = new PXCFaceData::LandmarkPoint[npoints];			// get the landmark data
			ldata->QueryPoints(points);
			lefteye.x = int(points[76].image.x);
			lefteye.y = int(points[76].image.y);
			righteye.x = int(points[77].image.x);
			righteye.y = int(points[77].image.y);
			//����opencv��Բ
			circle(color, lefteye, 3, CV_RGB(0, 255, 0));
			circle(color, righteye, 3, CV_RGB(0, 255, 0));

			stringstream ss;
			ss << heartrate;
			string Heartrate = ss.str();
			Heartrate = "Heartrate:" + Heartrate;
			putText(color, Heartrate, Point(20, 40), FONT_HERSHEY_COMPLEX, 1, c);
			if (expression) {
				if (smilescore.intensity>20)
					putText(color, "Smile", Point(20, 60), FONT_HERSHEY_COMPLEX, 1, c);
				if (mouthopenscore.intensity>20)
					putText(color, "MouthOpen", Point(20, 80), FONT_HERSHEY_COMPLEX, 1, c);
				if (tongueoutscore.intensity>90)
					putText(color, "TongueOut", Point(20, 100), FONT_HERSHEY_COMPLEX, 1, c);
			}
			if (detectiondata == NULL) {
				wprintf_s(L"Unabel to get detection data/n");
				return 5;
			}			//����ǰ������λ�����ݴ���rect��		
			PXCRectI32 rect;
			detectiondata->QueryBoundingRect(&rect);
			//PXCRectI32��opencv��Rect���ת��			
			Rect cvrect = Rect(rect.x, rect.y, rect.w, rect.h);
			DrawRectangle(color, cvrect);
		}
		colorIm->ReleaseAccess(&color_data);
		psm->ReleaseFrame();//Ϊ��һ֡�Ĵ�������׼��
		if (showimage)
			imshow("face_detection", color);//��ʾͼ��
		else
			cv::destroyWindow("face_detection");
		if (teminateprocessing)
		{
			cv::destroyWindow("face_detection");
			break;
		}
		waitKey(1);
	}
	CloseCalibWindows();
	smoother2D->Release();
	smootherFactory->Release();
	facedata->Release();
	cfg->Release();//����PXCFaceMoudle Instance
	psm->Close();
	psm->Release(); //����instance
}

