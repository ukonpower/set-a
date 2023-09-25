#include <common>
#include <packing>
#include <light_h>
#include <re>
#include <noise>

uniform sampler2D uGbufferPos;
uniform sampler2D uGbufferNormal;
uniform sampler2D uShadingBuffer;

uniform sampler2D uLightShaftTexture;
uniform sampler2D uSSRTexture;
uniform sampler2D uSSAOTexture;

uniform vec3 cameraPosition;
uniform float cameraNear;
uniform float cameraFar;

in vec2 vUv;

layout (location = 0) out vec4 outColor;

void main( void ) {

	vec4 gCol0 = texture( uGbufferPos, vUv );
	vec4 gCol1 = texture( uGbufferNormal, vUv );
	vec3 dir = normalize( cameraPosition - gCol0.xyz );
	float f = fresnel( dot( dir, gCol1.xyz ) );

	outColor += vec4( texture( uShadingBuffer, vUv ).xyz, 1.0 );
	outColor += texture( uSSRTexture, vUv ) * 0.3 * f;
	outColor *= max( 0.0, 1.0 - texture( uSSAOTexture, vUv ).x * 3.0 );
	outColor += texture( uLightShaftTexture, vUv ) * 0.2;

}