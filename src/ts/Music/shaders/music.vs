#include <common>
#include <noise>

in float offsetTime;

out float o_left;
out float o_right;

uniform float uDuration;
uniform float uSampleRate;

const float BPM = 76.0;

const float bassMelody[] = float[](
	8.0,  4.0,  6.0,  1.0,  4.0,  2.0,  5.0,  4.0
);

// const float mainCord[] = float[]( 
// 	2.0 + 0.0,  -3.0 + 0.0,  -2.0 + 0.0,  0.0 + 0.0,  -5.0 + 0.0,  -3.0 + 0.0,  -2.0 + 0.0,  0.0 + 0.0,
// 	2.0 + 3.0,  -3.0 + 3.0,  -2.0 + 4.0,  0.0 + 4.0,  -5.0 + 3.0,  -3.0 + 3.0,  -2.0 + 4.0,  0.0 + 4.0,
// 	2.0 + 7.0,  -3.0 + 7.0,  -2.0 + 7.0,  0.0 + 7.0,  -5.0 + 7.0,  -3.0 + 7.0,  -2.0 + 7.0,  0.0 + 7.0
// );

const float mainCord[] = float[]( 
	5.0,  8.0,  12.0,  10.0,  4.0, 5.0,  8.0,  12.0,  10.0,  4.0
);

const float mainMelody[] = float[](
	2.0 - 0.0,  0.0 - 0.0,  2.0 - 0.0,  5.0 - 0.0,  4.0 - 0.0,  2.0 - 0.0,  5.0 - 0.0,  4.0 - 0.0, 
	2.0 - 2.0,  0.0 - 2.0,  2.0 - 2.0,  5.0 - 1.0,  4.0 - 2.0,  2.0 - 2.0,  5.0 - 1.0,  4.0 - 2.0, 
	2.0 - 4.0,  1.0 - 4.0,  2.0 - 4.0,  5.0 - 3.0,  4.0 - 4.0,  2.0 - 4.0,  5.0 - 3.0,  4.0 - 4.0, 
	2.0 - 2.0,  0.0 - 2.0,  2.0 - 2.0,  5.0 - 1.0,  4.0 - 2.0,  2.0 - 2.0,  5.0 - 1.0,  4.0 - 2.0, 
	
	2.0 - 0.0,  0.0 - 0.0,  2.0 - 0.0,  5.0 - 0.0,  4.0 - 0.0,  2.0 - 0.0,  5.0 - 0.0,  4.0 - 0.0, 
	2.0 - 2.0,  0.0 - 2.0,  2.0 - 2.0,  5.0 - 1.0,  4.0 - 2.0,  2.0 - 2.0,  5.0 - 1.0,  4.0 - 2.0, 
	2.0 - 4.0,  1.0 - 4.0,  2.0 - 4.0,  5.0 - 3.0,  4.0 - 4.0,  2.0 - 4.0,  5.0 - 3.0,  4.0 - 4.0, 
	2.0 - 2.0,  0.0 - 2.0,  2.0 - 2.0,  5.0 - 1.0,  4.0 - 2.0,  2.0 - 2.0,  5.0 - 1.0,  4.0 - 2.0	
);

/*-------------------------------
	Utils
-------------------------------*/

float whiteNoise(float time)
{
    return fract(sin(dot(vec2( time ), vec2(12.9898,78.233))) * 43758.5453);
}


float saw(float time){

    return fract(-time)*2.-1.;
	
}

float square( float time) {

	return sign( fract( time ) - 0.1 );
	
}

float tri(float time ){
    return abs(2.*fract(time*.5-.25)-1.)*2.-1.;
}

float ssin(float time ) {
	return sin( time * TPI );
}

float s2f( float scale ){

	return 440.0 * pow( 1.06, scale );
	
}

float slope( float value, float slope ) {

	if( value >= 0.0 ) {

		return linearstep( 0.0, 1.0 - slope, value );

	} else {

		return linearstep( 0.0, -1.0 + slope, value ) * -1.0;
		
	}

	return 0.0;
	
}

bool isin( float time, float start, float end ) {

	return start <= time && time <= end;
	
}

/*-------------------------------
	Clap
-------------------------------*/

float clap( float time, float loop ) {

	float loopTime = fract(loop);

	float o = 0.0;
	o += fbm( loopTime * 700.0 ) * ( 
		exp( (loopTime - 0.0) * - 8.0 ) * step( 0.0, loopTime ) +
		exp( (loopTime - 0.15) * - 8.0 ) * step( 0.015, loopTime ) +
		exp( (loopTime - 0.03) * - 8.0 ) * step( 0.03, loopTime )
	) * 0.333;
	
	return o;
	
}

vec2 clap1( float time, float loop ) {

	vec2 o = vec2( 0.0 );
	float l = loop - 0.75;

	o += clap( time, l ) * float[]( 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0 )[int(l)];
	
	return o * 0.5;
	
}

/*-------------------------------
	cha
-------------------------------*/

float cha( float time, float loop ) {

	float envTime = fract(loop) * 10.0;

	float o = 0.0;
	
	float env = mix( exp( envTime * - 8.0 ), exp( fract(envTime * 14.0 ) * -5.0), exp( envTime  * -10.0  ) );
	
	o += fbm( envTime * 780.0 ) * env * 1.3;
	
	return o;

}

vec2 cha1( float time, float loop ) {

	vec2 o = vec2( 0.0 );

	float l = loop - 0.5;

	o += cha( time, l ) * float[]( 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0  )[int(l)];
	
	return o * 0.5;

}

/*-------------------------------
	Hihat
-------------------------------*/

float hihat( float time, float loop ) {

	return noise(time * 22000.0) * max(0.0,1.0-min(0.85,loop*4.25)-(loop-0.25)*0.3);

}

vec2 hihat1( float time, float loop ) {
	
	vec2 o = vec2( 0.0 );

	float l4 = loop * 4.0;

	o += hihat( time, fract( l4 ) ) * (step( 0.4, whiteNoise( floor( l4 )) ) * 0.5 + 0.5);
	o += hihat( time, fract( l4 + 0.5 ) ) * step( 0.5, whiteNoise(  floor(  l4 + 0.5 ) * 10.0 ) );
	o *= 0.04;
	
	return o;
  
}

/*-------------------------------
	Kick
-------------------------------*/

float kick( float time, float loop ) {

	float envTime = fract( loop );

	float t = time;
	t -= 0.12 * exp( -70.0 * envTime );
	t += 0.12;

	float o = ( 
		(smoothstep( -0.8, 0.8, sin( t * 110.0 ) ) * 2.0 - 1.0) +
		0.0
	) * exp( envTime * - 8.0 ) * slope( sin( envTime * PI ), 0.998 );

    return o;

}

vec2 kick1( float time, float loop ) {

	vec2 o = vec2( 0.0 );

	float loop2 = loop - 0.25;
	float loop3 = loop - 0.625;
	o += kick( time, loop ) * float[]( 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0  )[int( loop )];
	o += kick( time, loop2 ) * float[]( 0.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0, 1.0 )[int( loop2 )];

    return o;

}

float deepKick( float time, float loop ) {

	float o = 0.0;
	
	for( int i = 0; i < 4; i ++ ) {

		float fi = float( i ) / 4.0;
		float lt = loop - 0.17 * fi;
		
		float envTime = fract( lt );
		
		float t = time;
		t -= 0.15 * exp( -50.0 * envTime );

		float b = ( 
			(smoothstep( -1.0, 1.0, sin( t * 195.0 ) ) * 2.0 - 1.0) +
			0.0
		) * exp( envTime * - 10.0 ) * slope( sin( envTime * PI ), 0.998 );

		b *= 1.0 - fi;

		o += b;

	}

    return o;

}


/*-------------------------------
	BASS
-------------------------------*/


vec2 bass( float time, float loop ) {

	int index = int( loop );
	float envTime = fract( loop );

	vec2 o;

	for( int i = 0; i < 4; i++ ) {

		float fi = float( i ) / 8.0;

		float w = smoothstep( 0.1, 0.5, ssin( s2f( -45.0 + fi + bassMelody[index] ) * ( time + fi ) ) ) * 2.0 - 1.0;
		w *= .1;
		w *= smoothstep( 0.0, 1.0, sin( envTime * PI ) );
		o += w * ( sin( envTime * PI * 64.0 - PI / 2.0 ) * 0.5 + 0.5 );
		
	}

	return o;
	
}


vec2 cord( float time, float loop ) {

	int index = int( loop * 2.0 );
	float envTime = fract( loop );

	vec2 o = vec2( 0.0 );

	for( int i = 0; i < 1; i ++ ) {

		float offset = 0.0;

		if( i == 1 ) offset = 3.0;
		if( i == 2 ) offset = 7.0;

		float s = mainMelody[index] + offset;

		if( s == 1.0 || s == 3.0 || s == 5.0) s += 1.0;

		o += saw( s2f( -15.0 + s ) * pow( 0.5, 1.0 ) * ( time ) ) * 0.3;

	}

	o *= 0.0;

	return o;
	
}

/*-------------------------------
	Base
-------------------------------*/

vec2 lead1( float time, float loop ) {

	vec2 o = vec2( 0.0 );

	loop /= 2.0;

	for( int i = 0; i < 2; i ++ ) {

		vec2 s = vec2( 0.0 );

		float fi = float( i );
		float l = loop - 0.5 * fi;
		int index = int( l );
		float envTime = fract( l );

		for( int j = 0; j < 4; j++ ) {

			float scale = bassMelody[ index * 2 + i ] - 12.0 * 2.0 + float(j) * 12.0;
			float frec = s2f(scale) * 0.25;

			s += ssin( time * frec + tri( time * frec * 2.0 + saw( time * frec * 0.5 ) * 0.9 ) * 0.5 + slope( ssin( time * frec * 0.5 ), 0.3 ) * 0.1 ) * 
				slope( sin( envTime * PI ), 0.99 ) * exp( fract( l ) * -1.5 ) * sin( envTime * 8.0 );

			s *= 0.35;
				
		}

		s.x *= 0.7 + fi * 0.3;
		s.y *= 0.7 + (1.0 - fi) * 0.3;

		o += s;

	}

	return o;
	
}


vec2 lead2( float time, float loop ) {

	vec2 o = vec2( 0.0 );

	loop /= 2.0;

	for( int i = 0; i < 2; i ++ ) {

		vec2 s = vec2( 0.0 );

		float fi = float( i );
		float l = loop - 0.5 * fi;
		int index = int( l );
		float envTime = fract( l );

		for( int j = 0; j < 4; j++ ) {

			float scale = mainMelody[ index * 2 + i ] - 12.0 * 2.0 + float(j) * 12.0;
			float frec = s2f(scale) * 2.0;

			s += tri( time * frec ) * 
				slope( sin( envTime * PI ), 0.5 ) * exp( fract( l ) * -1.5 ) * sin( envTime * 8.0 );

				
		}

		s *= 0.4;

		s.x *= 0.7 + fi * 0.3;
		s.y *= 0.7 + (1.0 - fi) * 0.3;

		o += s;

	}
	
	return o;
	
}


/*-------------------------------
	Ambient 
-------------------------------*/

vec2 ambient( float time, float loop ) {

	vec2 o = vec2( 0.0 );
	
	o += fbm( time * 120.0 ) * vec2( 1.0, 0.8 );
	o += whiteNoise( time ) * 0.02 * vec2( 0.7, 1.0 );

	o *= 0.4;

	return o;

}



vec2 music( float time ) {

	float t = time * (BPM / 60.0);
	t = max( 0.0, t - 8.0 );

	float loop1 = fract( t );
	
	float loop4 = mod( t, 4.0 );
	float loop4Phase = floor( loop4 );

	float loop8 = mod( t, 8.0 );
	float loop8Phase = floor( loop8 );

	float loop16 = mod( t, 16.0 ); 
	float loop16Phase = loop16 / 16.0;
	
	float loop32 = mod( t, 32.0 );
	float loop32Phase = t / 32.0;

	vec2 o = vec2( 0.0 );

	// click

	// if( isin( loop32Phase, 0.0001, 100.0 ) ) {

	// 	o += step( fract( loop4 ), 0.1 ) * ssin( time * s2f(3.0) * 2.0 ) * 0.03;
	// 	o += step( fract( loop4 / 4.0 ), 0.05 ) * ssin( time * s2f(12.0) * 2.0 ) * 0.02;

	// }
	
	// sounds
	
	
	if( isin( loop32Phase, 0.0, 100.0 ) || isin( loop32Phase, 6.0, 8.0 ) ) {


		o += kick1( time, loop16 / 2.0 ) * 0.7;

		o += cha1( time, loop16 / 2.0 );

		o += bass( time, loop32 / 8.0 );


		// o += lead2( time, loop16 * 4.0 ) * 0.1;
	}
	
	// if( isin( loop32Phase, 1.0, 7.0 ) ) {

	// 	o += kick2( time, loop16 / 2.0 ) * 0.5;
		
	// }

	// if( isin( loop32Phase, 1.0, 4.0 ) || isin( loop32Phase, 5.0, 7.0 ) ) {

	// 	o += clap1( time, loop16 / 2.0 ) * 1.0;
		
	// }

	// if( isin( loop32Phase, 2.0, 7.0 )  ) {
		
	// 	o += lead1( time, loop16 * 4.0 ) * 0.3;

	// }

	// if( isin( loop32Phase, 5.0, 8.0 )  ) {
		
	// 	o += lead2( time, loop16 / 2.0 ) * 0.2;

	// }

	// if( isin( loop32Phase, 0.0, 8.0 )  ) {
		
	// 	o += ambient( time, loop32 ) * 0.5;

	// }

	return o;
	
}

void main( void ) {

	float time = offsetTime / uSampleRate;

	vec2 o = music( time );

	o_left = o.x;
	o_right = o.y;

}