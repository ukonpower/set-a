#include <common>
#include <vert_h>

layout ( location = 3 ) in float posY;
layout ( location = 4 ) in vec3 id;

out vec3 vId;

uniform sampler2D uComPosBuf;
uniform sampler2D uComVelBuf;
uniform vec2 uGPUResolution;
uniform vec4 uState;

#include <rotate>

mat3 makeRotationDir( vec3 direction, vec3 up ) {

	vec3 xaxis = normalize( cross( up, direction ) );
	vec3 yaxis = normalize( cross( direction, xaxis ) );

	return mat3(
		xaxis.x, yaxis.x, direction.x,
		xaxis.y, yaxis.y, direction.y,
		xaxis.z, yaxis.z, direction.z
	);

}


void main( void ) {

	#include <vert_in>

	vec4 comPosBuffer = texture( uComPosBuf, vec2( posY * 1.0, id.x ) );
	vec4 comVelBuffer = texture( uComVelBuf, vec2( posY * 1.0, id.x ) );
    vec4 nextPosBuffer = texture( uComPosBuf, vec2( posY - 1.0 / uGPUResolution.x, id.x ) );
	
	vec3 offsetPosition = comPosBuffer.xyz;
	
    vec3 delta = ( comPosBuffer.xyz - nextPosBuffer.xyz );
	vec3 vec = normalize( delta );

	// outPos *= 0.1 + (sin(id.x * TPI) * 0.5 + 0.5) * 0.9;
	outPos.xz *= ( 0.4 );

	mat2 offsetRot = rotate( PI / 2.0 );
	outPos.yz *= offsetRot;
	outNormal.yz *= offsetRot;

	mat3 rot = makeRotationDir(-vec, vec3( 0.0, -1.0, 0.0 ) );
	outPos *= rot;
	outNormal *= rot;

	outPos += offsetPosition;
	// outPos.xyz *= smoothstep( 0.0, 0.1, 1.0 - uState.y );

	vId = id;

	#include <vert_out>
	
}