#include <common>
#include <packing>
#include <light_h>
#include <re>

// uniforms

uniform sampler2D sampler0; // position, depth
uniform sampler2D sampler1; // normal, outss
uniform sampler2D sampler2; // albedo, roughness
uniform sampler2D sampler3; // emission, metalic

uniform vec3 uColor;
uniform mat4 viewMatrix;
uniform mat4 cameraMatrix;
uniform vec3 cameraPosition;
// varyings

in vec2 vUv;

// out

layout (location = 0) out vec4 glFragOut0;
layout (location = 1) out vec4 glFragOut1;

void main( void ) {

	//[
	vec4 tex0 = texture( sampler0, vUv );
	vec4 tex1 = texture( sampler1, vUv );
	vec4 tex2 = texture( sampler2, vUv );
	vec4 tex3 = texture( sampler3, vUv );

	Geometry geo = Geometry(
		tex0.xyz,
		tex1.xyz,
		0.0,
		normalize( cameraPosition - tex0.xyz ),
		vec3( 0.0 )
	);
	Material mat = Material(
		tex2.xyz,
		tex2.w,
		tex3.w,
		tex3.xyz,
		mix( tex2.xyz, vec3( 0.0, 0.0, 0.0 ), tex3.w ),
		mix( vec3( 1.0, 1.0, 1.0 ), tex2.xyz, tex3.w ),
		unpackColor( tex1.w )
	);
	vec3 outColor = vec3( 0.0 );
	//]
	
	// output

	#include <light>

	glFragOut0 = glFragOut1 = vec4( outColor.xyz, 1.0 );
	gl_FragDepth = 0.5;

}