//[

// outColor.xyz += 0.4;

float shadow;

// direcitonalLight

Light light;
LightCamera lightCamera;

#if NUM_LIGHT_DIR > 0 

	DirectionalLight dLight;

	#pragma loop_start NUM_LIGHT_DIR

		// shadow

		shadow = getShadowSmooth( tex0.xyz, directionalLightCamera[ LOOP_INDEX ], directionalLightShadowMap[ LOOP_INDEX ] );
		
		// lighting

		dLight = directionalLight[ LOOP_INDEX ];
		light.direction = dLight.direction;
		light.color = dLight.color;

		outColor.xyz += RE( geo, mat, light ) * shadow;

	#pragma loop_end

#endif

#if NUM_LIGHT_SPOT > 0

	SpotLight sLight;
	
	vec3 spotDirection;
	float spotDistance;
	float spotAngleCos;
	float spotAttenuation;
	vec3 radiance;

	#pragma loop_start NUM_LIGHT_SPOT

		// shadow

		shadow = getShadowSmooth( geo.position, spotLightCamera[ LOOP_INDEX ], spotLightShadowMap[ LOOP_INDEX ] );

		// lighting

		sLight = spotLight[ LOOP_INDEX ];

		spotDirection = normalize(sLight.position - geo.position);
		spotDistance = length( sLight.position - geo.position );
		spotAngleCos = dot( sLight.direction, spotDirection );
		spotAttenuation = 0.0;

		if( spotAngleCos > sLight.angle ) {

			spotAttenuation = smoothstep( sLight.angle, sLight.angle + ( 1.0 - sLight.angle ) * sLight.blend, spotAngleCos );

		}

		light.direction = spotDirection;
		light.color = sLight.color * spotAttenuation * pow( clamp( 1.0 - spotDistance / sLight.distance, 0.0, 1.0 ),  sLight.decay );

		radiance = RE( geo, mat, light );
		outColor.xyz += shadow * radiance;
		outColor.xyz += mat.subsurface * light.color;

	#pragma loop_end

#endif

outColor.xyz += mat.emission;
// outColor.xyz = mat.subsurface;

//]