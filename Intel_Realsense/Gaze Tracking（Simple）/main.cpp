#include "process.h"
#include <Windows.h>
#include <WindowsX.h>
#include <iostream>

#pragma comment( linker, "/subsystem:\"console\" /entry:\"WinMainCRTStartup\"")//��ʾconsole����̨
#define WIDTH 1920
#define HEIGHT 1080  
using namespace std;
HINSTANCE g_hInst = NULL;
volatile bool gazetracking = false;
volatile bool expression = false;
volatile bool showimage = false;
volatile bool need_calibration = true;
volatile bool cursorcontrol = false;
volatile bool changepage = false;
volatile bool teminateprocessing = false;

static DWORD WINAPI ProcessingThread(PVOID pParam)
{
	processing();
	return 0;
}
LRESULT CALLBACK MainWndProc(
	HWND hWnd,
	UINT nMsg,
	WPARAM wParam,
	LPARAM lParam
)
{
	int wmId, wmEvent;
	static HFONT hFont;
	static TCHAR szTextBuf[20];  //static �ؼ��ı�����������
	static HWND  hStatic; //������ִ��֮ǰ���� ���ڹ����ж���ı���ӦΪstatic ����ᱻ��;����
	static HWND  StartCalib;//����У׼��ť
	static HWND  Save;//���水ť
	static HWND  GroupBasicFunc;//�����
	static HWND  GroupAdvanceFunc;//�����
	static HWND  EyeTracking;//�۶�׷�ٸ�ѡ��
	static HWND  Expression;//���鸴ѡ��
	static HWND  ShowImage;//��ʾͼ��ѡ��
	static HWND  CursorControl;//������긴ѡ��
	static HWND  ChangePage;//��ҳ��ѡ��

	switch (nMsg)//�ж���ϢID
	{
	case  WM_CREATE:
		hFont = CreateFont(//��������
			-14, -7, 0, 0, 400,
			FALSE, FALSE, FALSE, DEFAULT_CHARSET,
			OUT_CHARACTER_PRECIS, CLIP_CHARACTER_PRECIS, DEFAULT_QUALITY,
			FF_DONTCARE, TEXT("΢���ź�")
		);

		hStatic = CreateWindow(
			L"static", //��̬�ı��������
			L"��ӭʹ��",  //�ؼ����ı�
			WS_CHILD /*�Ӵ���*/ | WS_VISIBLE /*����ʱ��ʾ*/ | SS_CENTER /*ˮƽ����*/ | SS_CENTERIMAGE /*��ֱ����*/,
			30 /*X����*/, 20 /*Y����*/, 240 /*���*/, 25 /*�߶�*/,
			hWnd,  //�����ھ��
			(HMENU)1,  //Ϊ�ؼ�ָ��һ��Ψһ��ʶ��
			g_hInst,  //��ǰ����ʵ�����
			NULL
		);
		//��������--��ѡ��
		GroupBasicFunc = CreateWindow(
			TEXT("button"), TEXT("��������"),
			WS_CHILD | WS_VISIBLE | BS_GROUPBOX,
			30, 50, 240, 150,
			hWnd, (HMENU)2, g_hInst, NULL
		);
		EyeTracking = CreateWindow(
			TEXT("button"), TEXT("�۶�׷��"),
			WS_CHILD | WS_VISIBLE | BS_LEFT | BS_AUTOCHECKBOX,
			50, 80, 150, 26,
			hWnd/*�����ڿؼ�*/, (HMENU)3, g_hInst, NULL
		);
		Expression = CreateWindow(
			TEXT("button"), TEXT("����ʶ��"),
			WS_CHILD | WS_VISIBLE | BS_LEFT | BS_AUTOCHECKBOX,
			50, 110, 150, 26,
			hWnd /*�����ڿؼ�*/, (HMENU)4, g_hInst, NULL
		);
		ShowImage = CreateWindow(
			TEXT("button"), TEXT("��ʾͼ��"),
			WS_CHILD | WS_VISIBLE | BS_LEFT | BS_AUTOCHECKBOX,
			50, 140, 150, 26,
			hWnd /*�����ڿؼ�*/, (HMENU)5, g_hInst, NULL
		);
		//��չ����--��ѡ��
		GroupAdvanceFunc = CreateWindow(
			TEXT("button"), TEXT("��չ����"),
			WS_CHILD | WS_VISIBLE | BS_GROUPBOX,
			30, 220, 240, 100,
			hWnd, (HMENU)6, g_hInst, NULL
		);
		CursorControl = CreateWindow(
			TEXT("button"), TEXT("�������"),
			WS_CHILD | WS_VISIBLE | BS_LEFT | BS_AUTOCHECKBOX,
			50, 250, 120, 26,
			hWnd, (HMENU)7, g_hInst, NULL
		);
		ChangePage = CreateWindow(
			TEXT("button"), TEXT("���ҷ�ҳ"),
			WS_CHILD | WS_VISIBLE | BS_LEFT | BS_AUTOCHECKBOX,
			50, 280, 120, 26,
			hWnd, (HMENU)8, g_hInst, NULL
		);
		//��ť
		StartCalib = CreateWindow(
			TEXT("button"), //��ť�ؼ�������
			TEXT("ֹͣ����"),
			WS_CHILD | WS_VISIBLE | WS_BORDER | BS_FLAT/*��ƽ��ʽ*/,
			50 /*X����*/, 400 /*Y����*/, 100 /*���*/, 25/*�߶�*/,
			hWnd, (HMENU)9 /*�ؼ�Ψһ��ʶ��*/, g_hInst, NULL
		);
		Save = CreateWindow(
			TEXT("button"), //��ť�ؼ�������
			TEXT("��������"),
			WS_CHILD | WS_VISIBLE | WS_BORDER | BS_FLAT/*��ƽ��ʽ*/,
			150 /*X����*/, 400 /*Y����*/, 100 /*���*/, 25/*�߶�*/,
			hWnd, (HMENU)10 /*�ؼ�Ψһ��ʶ��*/, g_hInst, NULL
		);
		SendMessage(StartCalib, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(Save, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(hStatic, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(GroupBasicFunc, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(GroupAdvanceFunc, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(EyeTracking, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(Expression, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(ShowImage, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(CursorControl, WM_SETFONT, (WPARAM)hFont, NULL);
		SendMessage(ChangePage, WM_SETFONT, (WPARAM)hFont, NULL);
		break;
	case WM_DESTROY: //�������ٵ���Ϣ
		PostQuitMessage(0); //�����˳���Ϣ
		break;
	case WM_COMMAND:
		wmId = LOWORD(wParam);
		wmEvent = HIWORD(wParam);
		if (wmEvent == BN_CLICKED)
		{
			switch (wmId)
			{
			case 3:
			case 4:
			case 5:
			case 7:
			case 8:
				if (SendMessage(EyeTracking, BM_GETCHECK, 0, 0) == BST_CHECKED) {
					gazetracking = true;
				}
				else if (SendMessage(EyeTracking, BM_GETCHECK, 0, 0) == BST_UNCHECKED)
					gazetracking = false;
				if (SendMessage(Expression, BM_GETCHECK, 0, 0) == BST_CHECKED) {
					expression = true;
				}
				else if (SendMessage(Expression, BM_GETCHECK, 0, 0) == BST_UNCHECKED)
					expression = false;
				if (SendMessage(ShowImage, BM_GETCHECK, 0, 0) == BST_CHECKED) {
					showimage = true;
				}
				else if (SendMessage(ShowImage, BM_GETCHECK, 0, 0) == BST_UNCHECKED)
					showimage = false;
				if (SendMessage(CursorControl, BM_GETCHECK, 0, 0) == BST_CHECKED) {
					cursorcontrol = true;
				}
				else if (SendMessage(CursorControl, BM_GETCHECK, 0, 0) == BST_UNCHECKED)
					cursorcontrol = false;
				if (SendMessage(ChangePage, BM_GETCHECK, 0, 0) == BST_CHECKED) {
					changepage = true;
				}
				else if (SendMessage(ChangePage, BM_GETCHECK, 0, 0) == BST_UNCHECKED)
					changepage = false;
				break;
			case 9:  //���°�ť
					 //�����ı��������
					 //SetWindowText(hStatic, TEXT("������У׼��ť"));
				teminateprocessing = true;
				break;
			case 10:  //���°�ť
					  //�����ı��������
				cout << "��������" << endl;
				teminateprocessing = false;
				need_calibration = true;
				CreateThread(0, 0, ProcessingThread, g_hInst, 0, 0);
				//SetWindowText(hStatic, TEXT("�����˸��°�ť"));
				break;
			default:
				//���������Ϣһ��Ҫ���� DefWindowProc ����
				return DefWindowProc(hWnd, nMsg, wParam, lParam);
			}
			break;
		}
	}
	//����ȱʡ����Ϣ�������
	return DefWindowProc(hWnd, nMsg, wParam, lParam);
}
BOOL MyRegister(LPCWSTR pszClassName)
{
	WNDCLASS wc = { 0 };
	ATOM  nAtom = 0;
	//����ע�ᴰ�ڵĲ���
	wc.style = CS_VREDRAW | CS_HREDRAW; //���ڷ��
	wc.lpfnWndProc = MainWndProc;//���ڹ���
	wc.cbClsExtra = 0;
	wc.cbWndExtra = 0;
	wc.hInstance = g_hInst;//��ǰ���ھ��
	wc.hIcon = NULL;//����ͼ��
	wc.hCursor = NULL;//�����ʽ
	wc.hbrBackground = (HBRUSH)GetSysColorBrush(COLOR_BTNFACE);//���ڱ�����ˢ
	wc.lpszMenuName = NULL;//���ڲ˵�
	wc.lpszClassName = pszClassName;//��������
									//ע�ᴰ��
	nAtom = RegisterClass(&wc);
	/*if (0 == nAtom)
	{
	MessageBox(NULL, L"Register Failed",
	L"Error", MB_OK | MB_ICONWARNING);
	return FALSE;
	}
	else
	{
	MessageBox(NULL, L"Register Successed",
	L"Successed", MB_OK);
	}*/
	return TRUE;
}



// ��ʾ����
void DisplayWnd(HWND hWnd)
{
	//��ʾ
	ShowWindow(hWnd, SW_SHOW);
	//ˢ��
	UpdateWindow(hWnd);
}

HWND MyCreate(LPCWSTR pszClassName)
{
	HWND hWnd = CreateWindow(
		pszClassName,
		L"Intel",
		WS_OVERLAPPEDWINDOW,
		100,
		100,
		300,
		500,
		NULL,
		NULL,
		g_hInst,
		NULL
	);
	/*if (NULL == hWnd)
	{
	MessageBox(NULL, L"CreateWnd Failed",
	L"Error", MB_OK);
	return NULL;
	}
	MessageBox(NULL, L"CreateWnd Successed",
	L"Successed", MB_OK);*/
	return hWnd;
}



int WINAPI WinMain(
	HINSTANCE hInst,
	HINSTANCE hPrevInst,
	LPSTR pszCmdLine,
	int   nShowCmd)
{
	HWND hWnd = NULL;
	g_hInst = hInst;
	//ע�ᴰ������
	MyRegister(L"MyWnd");
	//����ע�����͵Ĵ���
	hWnd = MyCreate(L"MyWnd");
	//��ʾ����
	DisplayWnd(hWnd);
	MSG msg = { 0 };
	//��Ϣѭ������,��ȡ��Ϣ
	while (GetMessage(&msg, NULL, 0, 0))
	{
		TranslateMessage(&msg);
		//�ɷ���Ϣ
		DispatchMessage(&msg);
	}
	return 0;
}

