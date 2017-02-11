const CC = 1;
const WS = 2;
const NL = 3;
const EM = 4;
const CD = 5;
const NU = 6;
const _$ = 7;
const AM = 8;
const SQ = 9;
const GS = 10;
const GE = 11;
const QU = 12;
const HY = 13;
const Do = 14;
const FS = 15;
const NO = 16;
const CO = 17;
const LT = 18;
const EQ = 19;
const GT = 20;
const QM = 21;
const CS = 22;
const ES = 23;
const CE = 24;
const CA = 25;
const BL = 26;
const PI = 27;
const BR = 28;
const _0 = 29;
const _A = 30;
const _B = 31;
const _C = 32;
const _D = 33;
const _E = 34;
const _F = 35;
const _G = 36;
const _H = 37;
const _I = 38;
const _J = 39;
const _K = 40;
const _L = 41;
const _M = 42;
const _N = 43;
const _O = 44;
const _P = 45;
const _Q = 46;
const _R = 47;
const _S = 48;
const _T = 49;
const _U = 50;
const _V = 51;
const _W = 52;
const _X = 53;
const _Y = 54;
const _Z = 55;
const _a = 56;
const _b = 57;
const _c = 58;
const _d = 59;
const _e = 60;
const _f = 61;
const _g = 62;
const _h = 63;
const _i = 64;
const _j = 65;
const _k = 66;
const _l = 67;
const _m = 68;
const _n = 69;
const _o = 70;
const _p = 71;
const _q = 72;
const _r = 73;
const _s = 74;
const _t = 75;
const _u = 76;
const _v = 77;
const _w = 78;
const _x = 79;
const _y = 80;
const _z = 81;

module.exports = [
	CC, // NUL
	CC, // SOH 
	CC, // STX
	CC, // ETX
	CC, // EOT
	CC, // ENQ
	CC, // ACK
	CC, // BEL
	CC, // BS
	WS, // HT
	NL, // LF
	CC, // VT
	CC, // FF
	NL, // CR
	CC, // SO
	CC, // SI
	CC, // DLE
	CC, // DC1
	CC, // DC2
	CC, // DC3
	CC, // DC4
	CC, // NAK
	CC, // SYN
	CC, // ETB
	CC, // CAN
	CC, // EM
	CC, // SUB
	CC, // ESC
	CC, // FS
	CC, // GS
	CC, // RS
	CC, // US
	WS, // Space
	EM, // !
	CD, // " CDATA
	NU, // #
	_$, // $ ANCHOR
	AM, // & 
	SQ, // ' SINGLE_QUOTE
	GS, // ( GROUP_START
	GE, // ) GROUP_END
	QU, // * QUANTIFIER
	QU, // + QUANTIFIER
	CD, // , CDATA
	HY, // -
	Do, // .
	FS, // /
	_0, // 0
	NO, // 1
	NO, // 2
	NO, // 3
	NO, // 4
	NO, // 5
	NO, // 6
	NO, // 7
	NO, // 8
	NO, // 9
	CO, // :
	CD, // ; CDATA
	LT, // <
	EQ, // =
	GT, // >
	QM, // ?
	CD, // @
	_A, // A <- LETTER
	_B, // B    LETTER
	_C, // C    LETTER
	_D, // D    LETTER
	_E, // E    LETTER
	_F, // F    LETTER
	_G, // G    LETTER
	_H, // H    LETTER
	_I, // I    LETTER
	_J, // J    LETTER
	_K, // K    LETTER
	_L, // L    LETTER
	_M, // M    LETTER
	_N, // N    LETTER
	_O, // O    LETTER
	_P, // P    LETTER
	_Q, // Q    LETTER
	_R, // R    LETTER
	_S, // S    LETTER
	_T, // T    LETTER
	_U, // U    LETTER
	_V, // V    LETTER
	_W, // W    LETTER
	_X, // X    LETTER
	_Y, // Y    LETTER
	_Z, // Z <- LETTER
	CS, // [ CLASS_START
	ES, // \ ESCAPE
	CE, // ] CLASS_END
	CA, // ^ ANCHOR
	CD, // _
	CD, // `
	_a, // a <- LETTER
	_b, // b    LETTER
	_c, // c    LETTER
	_d, // d    LETTER
	_e, // e    LETTER
	_f, // f    LETTER
	_g, // g    LETTER
	_h, // h    LETTER
	_i, // i    LETTER
	_j, // j    LETTER
	_k, // k    LETTER
	_l, // l    LETTER
	_m, // m    LETTER
	_n, // n    LETTER
	_o, // o    LETTER
	_p, // p    LETTER
	_q, // q    LETTER
	_r, // r    LETTER
	_s, // s    LETTER
	_t, // t    LETTER
	_u, // u    LETTER
	_v, // v    LETTER
	_w, // w    LETTER
	_x, // x    LETTER
	_y, // y    LETTER
	_z, // z <- LETTER
	BL, // { BRACE_LEFT
	PI, // | PIPE
	BR, // } BRACE_RIGHT
	CD, // ~
	CC, // DEL
];
