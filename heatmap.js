/**
 * heatmap.js
 * @author oldj
 * @blog http://oldj.net
 * last update: 2015-10-10 11:10:00
 */
! function(t) {
	function i(t, i, h) {
		this.canvas = t, this.width = i, this.height = h, this._init()
	}

	function h(t, i) {
		var h, a, n, r, o, _, f, e = 256,
			c = [],
			l = Math.floor(e * t),
			u = Math.floor(e * i);
		for (h = 0; l > h; h++) a = u > 1 ? Math.floor(256 * h / (u - 1)) : 255, a > 255 && (a = 255), r = [0, 0, 255, a], c.push(r);
		for (h = l; e > h; h++) o = 240 * (e - h - 1) / (e - l - 1), _ = 1, f = .5, n = s(o, _, f), a = u > 1 ? Math.floor(256 * h / (u - 1)) : 255, a > 255 && (a = 255), r = [n[0], n[1], n[2], a], c.push(r);
		return c
	}

	function s(t, i, h) {
		if (i > 0) {
			var s, a, n = 1 / 3,
				r = 1 / 6,
				o = 2 / 3,
				_ = .5 > h ? h * (1 + i) : 1 + i - h * i,
				f = 2 * h - _,
				e = t / 360,
				c = e + n,
				l = e - n,
				u = [c, e, l];
			for (s = 0; 3 > s; s++) a = u[s], 0 > a && (a += 1), a > 1 && (a -= 1), u[s] = a;
			for (s = 0; 3 > s; s++) a = u[s], a = r > a ? f + 6 * (_ - f) * a : .5 > a ? _ : o > a ? 6 * (_ - f) * (o - a) : f, u[s] = a;
			for (s = 0; 3 > s; s++) u[s] = Math.floor(256 * u[s])
		} else u = [h, h, h];
		return u
	}

	function a(t, i) {
		function h(t, h, s) {
			var n, r, o = [
				[t, h],
				[-t, h],
				[t, -h],
				[-t, -h],
				[h, t],
				[-h, t],
				[h, -t],
				[-h, -t]
			];
			for (n = 0; 8 > n; n++) r = i * o[n][1] + o[n][0], a[r] = s || 1
		}
		for (var s, a = {}, n = 0, r = t, o = 3 - (t << 1); r >= n;) {
			for (s = n; r + 1 > s; s++) h(n, s, r + 1 - s);
			0 > o ? o += (n << 2) + 6 : (o += (n - r << 2) + 10, r--), n++
		}
		var _, f = [];
		for (_ in a) a.hasOwnProperty(_) && f.push([parseInt(_), a[_]]);
		return f
	}
	i.prototype = {
		_init: function() {
			this.canvas.width = this.width, this.canvas.height = this.height, this._ctx = this.canvas.getContext("2d"), this._colors = h(.382, .618), this._circle = a(16, this.width), this.clear()
		},
		addData: function(t) {
			var i, h, s, a = t.length,
				n = this.width,
				r = this._size;
			if (0 != a) {
				for (i = 0; a > i; i++) h = t[i], s = h[1] * n + h[0], isNaN(s) || s >= r || this._heat(s, h[2] || 1);
				this._is_flat = !1
			}
		},
		_heat: function(t, i) {
			this._original_points[t] += i;
			var h, s, a, n = this._original_points,
				r = this._circle,
				o = r.length,
				_ = this._size;
			for (h = 0; o > h; h++) s = r[h], a = t + s[0], 0 > a || a >= _ || (n[a] += s[1])
		},
		_newEmptyArray: function(t) {
			for (var i = []; t--;) i.push(0);
			return i
		},
		clear: function() {
			this._is_flat = !1, this._size = this.width * this.height, this._original_points = this._newEmptyArray(this._size), this._flat_points = this._newEmptyArray(this._size), this.canvas.width = this.width, this.canvas.height = this.height
		},
		_findMax: function(t) {
			var i, h, s, a = 0;
			try {
				a = Math.max.apply(null, t)
			} catch (n) {
				for (i = 0, h = t.length; h > i; i++)(s = t[i]) > a && (a = s)
			}
			return a
		},
		_doFlat: function() {
			if (!this._is_flat) {
				var t, i = this._findMax(this._original_points),
					h = 255 / i,
					s = this._size,
					a = this._flat_points,
					n = this._original_points;
				for (t = 0; s > t; t++) a[t] = Math.floor(n[t] * h);
				this._is_flat = !0
			}
		},
		render: function() {
			this._doFlat();
			var t, i, h, s = this.width,
				a = this.height,
				n = this._ctx.createImageData(s, a),
				r = n.data,
				o = this._size,
				_ = this._flat_points,
				f = this._colors;
			for (t = 0; o > t; t++) i = f[_[t]], h = t << 2, r[h] = i[0], r[h + 1] = i[1], r[h + 2] = i[2], r[h + 3] = i[3];
			this._ctx.putImageData(n, 0, 0)
		}
	}, t.HeatMap = i
}(window);