#include <common>
#include <packing>
#include <frag_h>
#include <sdf>
#include <rotate>

#define MARCH 64

uniform vec3 cameraPosition;
uniform mat4 modelMatrixInverse;

vec2 D( vec3 p ) {

	vec3 pp = p;
	pp.y += 0.15;

	vec2 d = vec2( 99999.0, 0.0 );

	// box

	vec3 pBox =  pp + vec3( 0.0, -0.5, 0.15 );
	pBox.z -= smoothstep( -0.4, 1.3, pp.y ) * 0.5;
	float dBox = opRound( sdBox( pBox, vec3(
		0.05 + smoothstep( 0.0, 1.0, pBox.y ) * -0.02 + pow( linearstep( 0.5, -0.3, pp.y ), 2.0 ) * ( 0.15 - smoothstep( 0.2, -0.15, pBox.z ) * 0.15 ),
		0.7,
		0.005 + smoothstep( 1.0, -1.0, pp.y ) * 0.1
	) ), 0.06 );

	// sph

	vec3 pSph = pp;
	pSph.y += 0.47;
	pSph.z += 0.10;
	pSph.y *= 0.65;
	pSph.yz *= rotate( PI / 2.3 );
	float dSph = sdRoundedCylinder( pSph, 0.18 - linearstep( 0.3, -0.3, pSph.y ) * 0.1, 0.05, 0.12 );

	// gattai

	float shape = opSmoothAdd( dBox, dSph, 0.1 );
	d = add( d, vec2( shape, 1.0 ) );
	d.x = opSmoothSubtraction( sdRoundedCylinder( pSph * vec3( 1.2, 1.0, 1.09) + vec3( 0.0, -0.15, 0.01), 0.18 - linearstep( 0.3, -0.3, pSph.y ) * 0.1, 0.05, 0.15 ), d.x, 0.04 );

	vec3 ppp = pp;
	ppp.yz *= rotate( 0.3 );
	ppp *= vec3( 1.0, 0.5, 1.0 );
	d.x = opSmoothSubtraction( opRound( sdBox( pBox * vec3( 1.9, 1.0, 1.0) + vec3( 0.0, 0.0, -0.15 ), vec3(
		0.05 + smoothstep( 0.0, 1.0, pBox.y ) * -0.02 + pow( linearstep( 0.5, -0.3, pp.y ), 2.0 ) * ( 0.15 - smoothstep( 0.2, -0.15, pBox.z ) * 0.15 ),
		0.7,
		0.005 + smoothstep( 1.0, -1.0, pp.y ) * 0.1
	) ), 0.06 ), d.x, 0.08 );

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

	vec3 rayPos = ( modelMatrixInverse * vec4( vPos, 1.0 ) ).xyz;
	vec3 rayDir = normalize( ( modelMatrixInverse * vec4( normalize( vPos - cameraPosition ), 0.0 ) ).xyz );
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

	outRoughness = 0.2;
	outMetalic = 0.0;
	outColor.xyz = vec3( 1.0, 1.0, 1.0 );

	float dnv = dot( -rayDir, normal );
	// outEmission += (1.0 - dnv) * vec3( 1.0, 0.6, 0.0 ) * 0.5;
		
	outNormal = normalize(modelMatrix * vec4( normal, 0.0 )).xyz;

	if( !hit ) discard;

	outPos = ( modelMatrix * vec4( rayPos, 1.0 ) ).xyz;

	#include <frag_out>

}