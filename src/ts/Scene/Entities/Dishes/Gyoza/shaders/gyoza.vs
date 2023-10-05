#include <common>
#include <vert_h>

layout (location = 3) in vec2 num;

out mat4 instanceMatrix;
out mat4 instanceMatrixInv;

uniform float uTime;
uniform float uTimeSeq;
uniform float uTimeSeqPrev;
uniform vec4 uState;

out float vFin;

// https://github.com/glslify/glsl-inverse

mat4 inverse(mat4 m) {
  float
      a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
      a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
      a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
      a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],

      b00 = a00 * a11 - a01 * a10,
      b01 = a00 * a12 - a02 * a10,
      b02 = a00 * a13 - a03 * a10,
      b03 = a01 * a12 - a02 * a11,
      b04 = a01 * a13 - a03 * a11,
      b05 = a02 * a13 - a03 * a12,
      b06 = a20 * a31 - a21 * a30,
      b07 = a20 * a32 - a22 * a30,
      b08 = a20 * a33 - a23 * a30,
      b09 = a21 * a32 - a22 * a31,
      b10 = a21 * a33 - a23 * a31,
      b11 = a22 * a33 - a23 * a32,

      det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  return mat4(
      a11 * b11 - a12 * b10 + a13 * b09,
      a02 * b10 - a01 * b11 - a03 * b09,
      a31 * b05 - a32 * b04 + a33 * b03,
      a22 * b04 - a21 * b05 - a23 * b03,
      a12 * b08 - a10 * b11 - a13 * b07,
      a00 * b11 - a02 * b08 + a03 * b07,
      a32 * b02 - a30 * b05 - a33 * b01,
      a20 * b05 - a22 * b02 + a23 * b01,
      a10 * b10 - a11 * b08 + a13 * b06,
      a01 * b08 - a00 * b10 - a03 * b06,
      a30 * b04 - a31 * b02 + a33 * b00,
      a21 * b02 - a20 * b04 - a23 * b00,
      a11 * b07 - a10 * b09 - a12 * b06,
      a00 * b09 - a01 * b07 + a02 * b06,
      a31 * b01 - a30 * b03 - a32 * b00,
      a20 * b03 - a21 * b01 + a22 * b00) / det;
}

mat4 getMat( float time ) {

	vec3 move = vec3( 0.0 );

	float t = time + num.y * TPI;
	
	vec3 posRot = vec3( 0.0 );
	float r = min( uState.w, 1.0 );
	posRot.x += sin( t ) * r;
	posRot.z += cos( t ) * r;

	vec3 posAlign = vec3( 0.0 );
	posAlign.x += ( num.x - 0.5 ) * 1.5;

	float fin = smoothstep( 0.0, 1.0, -num.x * 0.5 + clamp( uState.w - 2.0, 0.0, 1.0 ) * 1.5 );
	float rotY = mix( t, TPI * 7.0 + PI / 2.0, clamp( uState.w - 1.0, 0.0, 1.0 ) );
	float rotX = fin * (-PI - 0.2);

	vFin = fin;

	move = mix( posRot, posAlign, clamp(uState.w, 1.0, 2.0 ) - 1.0 );
	move.y -= fin * 0.15;
	move.x += fin * 0.15;

	instanceMatrix = mat4(
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		move.x, move.y, move.z, 1.0
	);

	instanceMatrix *= mat4(
		cos(rotY), 0.0, sin(rotY), 0.0,
		0.0, 1.0, 0.0, 0.0,
		- sin( rotY ), 0.0, cos( rotY ), 0.0,
		0.0, 0.0, 0.0, 1.0
	);

	instanceMatrix *= mat4(
		1.0, 0.0, 0.0, 0.0,
		0.0, cos( rotX ), - sin( rotX ), 0.0,
		0.0, sin( rotX ), cos( rotX ), 0.0,
		0.0, 0.0, 0.0, 1.0
	);

	return instanceMatrix;

}

void main( void ) {

	#include <vert_in>

	vec3 move = vec3( 0.0 );

	mat4 prevMatrix = getMat( uTimeSeqPrev );

	mat4 currentMatrix = getMat( uTimeSeq );
	instanceMatrix = currentMatrix;
	instanceMatrixInv = inverse(instanceMatrix);

	vec4 modelPosition = modelMatrix * currentMatrix * vec4(outPos, 1.0);
	vec4 mvPosition = viewMatrix * modelPosition;
	gl_Position = projectionMatrix * mvPosition;

	vec4 modelPositionPrev = modelMatrixPrev * prevMatrix * vec4(outPos, 1.0);
	vec4 mvPositionPrev = viewMatrixPrev * modelPositionPrev;
	vec4 positionPrev = projectionMatrixPrev * mvPositionPrev;

	vUv = outUv;
	vViewNormal = (normalMatrix * vec4(outNormal, 0.0)).xyz;
	vNormal = (modelMatrix * vec4(outNormal, 0.0)).xyz;
	vPos = modelPosition.xyz;
	vMVPosition = mvPosition.xyz;
	vMVPPosition = gl_Position.xyz / gl_Position.w;

	vVelocity = vMVPPosition.xy - positionPrev.xy / positionPrev.w;
	
}