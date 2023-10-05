#include <common>
#include <packing>
#include <frag_h>
#include <sdf>
#include <rotate>

#define MARCH 80

uniform vec3 cameraPosition;
uniform mat4 modelMatrixInverse;

uniform vec4 uState;

in mat4 instanceMatrix;
in mat4 instanceMatrixInv;

vec2 D( vec3 p ) {

	p *= 0.9;

	p += vec3( 0.0, 0.05, 0.05 ) * uState.w;

	vec2 d = vec2( 99999.0, 0.0 );
	vec3 pp = p;

	float k = uState.x;
    float c = cos(k*pp.x);
    float s = sin(k*pp.x);
    mat2  m = mat2(c,-s,s,c);
    vec3  q = vec3(m*pp.xz,pp.y);

	vec3 p2 = q;
	p2.y *= 1.0;
	d = add( d, vec2( sdVesicaSegment( p2, vec3(-0.4, 0.0, 0.0 ), vec3(0.4, 0.0, 0.0 ), 0.18 ), 0.0 ) );

	vec3 pq = p;
	pq.z += sin( pq.x * 45.0 ) * 0.03;
	pq.z -= -0.05 + sin( abs( pq.x ) ) * 0.12;
	vec3 p3 = vec3(m*pq.xz,pq.y);
	p3.z *= 1.4;
	d.x = opSmoothAdd( d.x, max( sdRoundedCylinder( p3, 0.2, 0.008, 0.005 ), -p.y ), 0.05 );

	d.x = opSmoothSubtraction( sdBox( pp + vec3( 0.0, 0.3, 0.0 ), vec3( 0.5, 0.2, 0.2 ) ), d.x, 0.03 );
	d *= 0.6;

	d.x = mix( sdSphere( pp, 0.15 ), d.x, uState.z );

	return d;

}

vec3 N( vec3 pos, float delta ){

    return normalize( vec3(
		D( pos ).x - D( vec3( pos.x - delta, pos.y, pos.z ) ).x,
		D( pos ).x - D( vec3( pos.x, pos.y - delta, pos.z ) ).x,
		D( pos ).x - D( vec3( pos.x, pos.y, pos.z - delta ) ).x
	) );
	
}

void main( void ) {

	#include <frag_in>

	vec3 rayPos = (  instanceMatrixInv * modelMatrixInverse * vec4( vPos, 1.0 ) ).xyz;
	vec3 rayDir = normalize( ( instanceMatrixInv * modelMatrixInverse * vec4( normalize( vPos - cameraPosition ), 0.0 ) ).xyz );
	vec2 dist = vec2( 0.0 );
	bool hit = false;

	vec3 normal;
	
	for( int i = 0; i < MARCH; i++ ) { 

		dist = D( rayPos );		
		rayPos += dist.x * rayDir;

		if( dist.x < 0.001 ) {

			normal = N( rayPos, 0.0001 );
			hit = true;
			break;

		}
		
	}

	outColor.xyz = mix( vec3( 1.0 ), vec3( 1.0, 1.0, 8.0 ), uState.y );

	float dnv = dot( -rayDir, normal );
	outSS += (1.0 - dnv) * vec3( 1.0, 0.6, 0.0 ) * 0.2 * uState.y;
		
	outNormal = normalize(modelMatrix * instanceMatrix * vec4( normal, 0.0 )).xyz;

	if( !hit ) discard;

	outPos = ( modelMatrix * instanceMatrix * vec4( rayPos, 1.0 ) ).xyz;

	#include <frag_out>

}