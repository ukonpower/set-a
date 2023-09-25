#include <common>
#include <packing>
#include <light_h>
#include <noise>

// uniforms

uniform sampler2D uGbufferPos;
uniform sampler2D uGbufferNormal;
uniform sampler2D uSceneTex;
uniform sampler2D uSSRBackBuffer;
uniform sampler2D uDepthTexture;

uniform float uTime;
uniform float uFractTime;
uniform mat4 cameraMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 projectionMatrixInverse;
uniform vec3 cameraPosition;

// varying

in vec2 vUv;

layout (location = 0) out vec4 outColor;

#define MARCH 24.0
#define LENGTH 20.0

void main( void ) {

	vec3 lightShaftSum = vec3( 0.0 );

	vec3 rayPos = texture( uGbufferPos, vUv ).xyz;
	vec4 rayViewPos = viewMatrix * vec4(rayPos, 1.0);
	vec4 depthRayPos = projectionMatrixInverse * vec4( vUv * 2.0 - 1.0, texture( uDepthTexture, vUv ).x * 2.0 - 1.0, 1.0 );
	depthRayPos.xyz /=depthRayPos.w;

	if( abs(rayViewPos.z - depthRayPos.z) > 0.1 || length(rayPos - cameraPosition) > 100.0 ) {

		outColor = vec4( 0.0, 0.0, 0.0, 1.0 );
		return;
		
	}

	if( rayPos.x + rayPos.y + rayPos.z == 0.0 ) return;

	vec3 rayDir = reflect( normalize( ( cameraMatrix * projectionMatrixInverse * vec4( vUv * 2.0 - 1.0, 1.0, 1.0 ) ).xyz ), texture( uGbufferNormal, vUv ).xyz ) ;

	float rayStepLength = LENGTH / MARCH;
	vec3 rayStep = rayDir * rayStepLength;

	float totalRayLength = random(vUv + uFractTime) * rayStepLength;
	rayPos += rayDir * totalRayLength;

	vec3 col;

	for( int i = 0; i < int( MARCH ); i ++ ) {

		vec4 depthCoord = (projectionMatrix * viewMatrix * vec4(rayPos, 1.0 ) );
		depthCoord.xy /= depthCoord.w;

		if( abs( depthCoord.x ) > 1.0 || abs( depthCoord.y ) > 1.0 ) break;

		depthCoord.xy = depthCoord.xy * 0.5 + 0.5;
		float samplerDepth = texture(uDepthTexture, depthCoord.xy).x;

		vec4 rayViewPos = viewMatrix * vec4( rayPos, 1.0 );
		vec4 depthViewPos = projectionMatrixInverse * vec4( depthCoord.xy * 2.0 - 1.0, samplerDepth * 2.0 - 1.0, 1.0 );
		depthViewPos.xyz /= depthViewPos.w;

		if( rayViewPos.z < depthViewPos.z && rayViewPos.z >= depthViewPos.z - 1.0 ) {

			col = texture( uSceneTex, depthCoord.xy ).xyz;
			break;

		}
		
		rayPos += rayStep;
		totalRayLength += rayStepLength;

	}

	outColor = vec4( mix( texture( uSSRBackBuffer, vUv ).xyz, col, 0.2 ), 1.0 );

}