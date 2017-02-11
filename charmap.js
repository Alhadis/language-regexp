"use strict";

const CC =  1; // Control character
const HS =  2; // Horizontal whitespace
const VS =  3; // Vertical whitespace
const EM =  4; // Exclamation mark
const CD =  5; // Character data
const NU =  6; // Number sign
const _$ =  7; // Dollar sign
const AM =  8; // Ampersand
const SQ =  9; // Single quote
const GS = 10; // Group start
const GE = 11; // Group end
const QU = 12; // Quantifier
const HY = 13; //  -   │
const Do = 14; //  .   │
const FS = 15; //  /   │
const NO = 16; // 1-9  │
const CO = 17; //  :   │
const LT = 18; //  <   │
const EQ = 19; //  =   │
const GT = 20; //  >   │
const QM = 21; //  ?   │
const CS = 22; //  [   │
const ES = 23; //  \   │
const CE = 24; //  ]   │
const CA = 25; //  ^   │
const BL = 26; //  {   │
const PI = 27; //  |   │
const BR = 28; //  }   │
const _0 = 29; const _A = 30; const _B = 31; const _C = 32; const _D = 33; const _E = 34; const _F = 35;
const _G = 36; const _H = 37; const _I = 38; const _J = 39; const _K = 40; const _L = 41; const _M = 42;
const _N = 43; const _O = 44; const _P = 45; const _Q = 46; const _R = 47; const _S = 48; const _T = 49;
const _U = 50; const _V = 51; const _W = 52; const _X = 53; const _Y = 54; const _Z = 55; const _a = 56;
const _b = 57; const _c = 58; const _d = 59; const _e = 60; const _f = 61; const _g = 62; const _h = 63;
const _i = 64; const _j = 65; const _k = 66; const _l = 67; const _m = 68; const _n = 69; const _o = 70;
const _p = 71; const _q = 72; const _r = 73; const _s = 74; const _t = 75; const _u = 76; const _v = 77;
const _w = 78; const _x = 79; const _y = 80; const _z = 81;

// Character class table
const charmap = [
	CC, CC, CC, CC, CC, CC, CC, CC, CC, HS, VS, CC, CC, VS, CC, CC, CC, CC,
	CC, CC, CC, CC, CC, CC, CC, CC, CC, CC, CC, CC, CC, CC, HS, EM, CD, NU,
	_$, AM, SQ, GS, GE, QU, QU, CD, HY, Do, FS, _0, NO, NO, NO, NO, NO, NO,
	NO, NO, NO, CO, CD, LT, EQ, GT, QM, CD, _A, _B, _C, _D, _E, _F, _G, _H,
	_I, _J, _K, _L, _M, _N, _O, _P, _Q, _R, _S, _T, _U, _V, _W, _X, _Y, _Z,
	CS, ES, CE, CA, CD, CD, _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l,
	_m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, BL, PI, BR, CD, CC
];

// State codes
const GO = 0;
const A$ = 1; // EOL anchor

// State transition table
const STT = [
/*            GO CC HS VS EM CD #   $  &  ' (   ) QU HY Do FS NO CO LT EQ GT QM CS ES CE CA BL PI BR _0 _A _B _C _D _E _F _G _H _I _J _K _L _M _N _O _P _Q _R _S _T _U _V _W _X _Y _Z _a _b _c _d _e _f _g _h _i _j _k _l _m _n _o _p _q _r _s _t _u _v _w _x _y _z
/* Start: */ [GO,-1,-1,-1,-1,-1,-1,A$,-1,-1,-2,__,-1,-1,Do,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
/* Dot: . */ [__,-1,-1,-1,-1,-1,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],
/* EOL: $ */ [__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__,__],

];


module.exports = {STT, charmap};
