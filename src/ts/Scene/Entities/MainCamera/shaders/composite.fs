#include <common>

uniform sampler2D backbuffer0;
uniform sampler2D uBloomTexture[4];

uniform vec3 cameraPosition;
uniform float cameraNear;
uniform float cameraFar;

in vec2 vUv;

layout (location = 0) out vec4 outColor;

vec2 lens_distortion(vec2 r, float alpha) {
    return r * (1.0 - alpha * dot(r, r));
}

// https://github.com/dmnsgn/glsl-tone-map/blob/main/filmic.glsl

vec3 filmic(vec3 x) {
  vec3 X = max(vec3(0.0), x - 0.004);
  vec3 result = (X * (6.2 * X + 0.5)) / (X * (6.2 * X + 1.7) + 0.06);
  return pow(result, vec3(2.2));
}

void main( void ) {


	vec3 col = vec3( 0.0, 0.0, 0.0 );
	vec2 uv = vUv;
	vec2 cuv = uv - 0.5;
	float len = length(cuv);

	col = texture( backbuffer0, vUv ).xyz;
	// col = filmic( col ) * 1.0;

	#pragma loop_start 4
		col += texture( uBloomTexture[ LOOP_INDEX ], uv ).xyz * ( 0.5 + float(LOOP_INDEX) * 0.5 ) * 0.1;
	#pragma loop_end

	col *= smoothstep( 1.0, 0.4, len );

	outColor = vec4( col, 1.0 );

}