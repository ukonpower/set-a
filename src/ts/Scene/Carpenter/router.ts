import * as GLP from 'glpower';

import { DustParticles } from '../Entities/DustParticles';
import { Floor } from '../Entities/Floor';
import { Chopsticks } from '../Entities/Chopsticks';
import { Chahan } from '../Entities/Dishes/Chahan';
import { Ramen } from '../Entities/Dishes/Ramen';
import { Renge } from '../Entities/Renge';
import { Shoyu } from '../Entities/Shoyu';
import { ChahanPara } from '../Entities/Dishes/ChahanPara';
import { Skybox } from '../Entities/Skybox';
import { Gyoza } from '../Entities/Dishes/Gyoza';
import { Menu } from '../Entities/Menu';
import { Chochin } from '../Entities/Chochin';
import { Noren } from '../Entities/Noren';
import { Men } from '../Entities/Dishes/Men';
import { Title } from '../Entities/Title';

export const router = ( node: GLP.BLidgeNode ) => {

	// class

	if ( node.class == "Skybox" ) {

		return new Skybox();

	} else if ( node.class == "Dust" ) {

		return new DustParticles();

	} else if ( node.class == "Floor" ) {

		return new Floor();

	} else if ( node.class == 'Chop' ) {

		return new Chopsticks();

	} else if ( node.class == "Chahan" ) {

		return new Chahan();

	} else if ( node.class == "Ramen" ) {

		return new Ramen();

	} else if ( node.class == "Renge" ) {

		return new Renge();

	} else if ( node.class == "Shoyu" ) {

		return new Shoyu();

	} else if ( node.class == "ChahanPara" ) {

		return new ChahanPara();

	} else if ( node.class == "Gyoza" ) {

		return new Gyoza();

	} else if ( node.class == "Menu" ) {

		return new Menu();

	} else if ( node.class == "Chochin" ) {

		return new Chochin();

	} else if ( node.class == "Noren" ) {

		return new Noren();

	} else if ( node.class == "Men" ) {

		return new Men();

	} else if ( node.class == "TChahan" ) {

		return new Title( `
		<svg width="1585" height="1853" viewBox="0 0 1585 1853" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M1423.32 506.992L1400.88 656.306C1387.24 530.796 1364.58 398.072 1332.9 258.136L1354.02 115.314C1376.9 209.086 1400 339.645 1423.32 506.992ZM1336.2 1608.45C1381.52 1588.26 1427.39 1448.32 1473.81 1188.64C1503.07 1008.31 1528.26 760.177 1549.38 444.237C1551.58 411.056 1552.9 380.039 1553.34 351.186L1584.69 411.778L1578.09 496.172C1530.35 1214.61 1455.55 1648.13 1353.69 1796.72L1336.2 1608.45Z" fill="white"/>
		<path d="M1177.14 171.578V247.316L1180.77 374.991C1185.83 589.945 1196.94 835.916 1214.1 1112.9C1223.34 1261.5 1236.65 1401.43 1254.03 1532.71C1257.11 1555.8 1260.96 1576.72 1265.58 1595.47H1265.91L1241.49 1742.62C1241.49 1735.41 1238.85 1711.6 1233.57 1671.21C1195.51 1385.56 1168.56 931.131 1152.72 307.908C1151.62 268.956 1150.3 233.611 1148.76 201.873L1177.14 171.578ZM1062.63 182.397L1091.67 197.545C1090.35 206.201 1089.25 247.316 1088.37 320.891C1081.33 833.031 1058.45 1272.32 1019.73 1638.75C1014.45 1693.57 1011.81 1724.59 1011.81 1731.8L984.09 1599.8C1007.85 1433.89 1024.02 1269.43 1032.6 1106.41C1046.9 885.687 1056.47 644.044 1061.31 381.483C1062.19 306.465 1062.63 240.103 1062.63 182.397Z" fill="white"/>
		<path d="M672.24 1004.71L658.05 783.981L699.96 851.064H870.9L930.3 840.244L922.05 1030.67L870.9 1004.71H672.24Z" fill="white"/>
		<path d="M511.2 1294.68L484.14 1244.91L535.62 792.637L441.24 907.327L476.88 1805.37L452.79 1852.98L416.49 939.787L350.49 1024.18L343.23 857.556L410.55 781.817L397.02 450.73L421.44 405.286L435.3 749.358L558.72 606.535L576.87 721.226L511.2 1294.68Z" fill="white"/>
		<path d="M24.1198 225.676C101.78 218.463 161.51 160.036 203.31 50.3947L215.52 0.623413L245.55 149.937L214.53 212.692C191.65 253.086 175.15 281.218 165.03 297.087L164.04 712.569H253.47C259.19 712.569 264.69 708.963 269.97 701.749V890.015C265.13 881.359 259.63 877.031 253.47 877.031H163.38C159.86 1368.97 123.67 1682.03 54.8098 1816.19L30.3898 1662.55C97.9298 1590.42 133.79 1328.58 137.97 877.031H16.5298C10.8098 877.031 5.30978 881.359 0.0297852 890.015V701.749C1.78979 706.077 6.18979 709.684 13.2298 712.569H138.63L139.29 320.891C111.35 349.744 79.6698 372.105 44.2498 387.974L24.1198 225.676Z" fill="white"/>
		</svg>
		` );

	}

	const baseEntity = new GLP.Entity();

	return baseEntity;

};
