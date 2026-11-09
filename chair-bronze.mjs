export function buildBronzeChair(THREE, RoundedBoxGeometry, grain = null) {
 const chair = new THREE.Group();
 const fixed = new THREE.Group();
 const swivel = new THREE.Group();
 chair.add(fixed, swivel);
 const leather = new THREE.MeshStandardMaterial({name:'leather',color:grain ? 0xd3cec8 : 0x242220,map:grain,bumpMap:grain,bumpScale:.006,roughness:.66,envMapIntensity:.62});
 const edge = new THREE.MeshStandardMaterial({name:'edge',color:0x24201c,roughness:.76});
 const bronze = new THREE.MeshStandardMaterial({name:'bronze',color:0xb18c5e,metalness:.95,roughness:.29,envMapIntensity:1.12});
 const steel = new THREE.MeshStandardMaterial({name:'steel',color:0x9e8b72,metalness:1,roughness:.24,envMapIntensity:1.16});
 const blackMetal = new THREE.MeshStandardMaterial({name:'blackMetal',color:0x292522,metalness:.73,roughness:.36,envMapIntensity:.73});
 const stitch = new THREE.MeshStandardMaterial({name:'stitch',color:0x3b332b,roughness:.96});
 function mesh(parent, geometry, material, x=0, y=0, z=0) {
  const part = new THREE.Mesh(geometry,material);
  part.position.set(x,y,z);
  parent.add(part);
  return part;
 }
 function pad(parent,w,h,d,r,mat,x,y,z) {
  return mesh(parent,new RoundedBoxGeometry(w,h,d,4,r),mat,x,y,z);
 }
 function cylinder(parent,top,bottom,height,mat,x,y,z) {
  return mesh(parent,new THREE.CylinderGeometry(top,bottom,height,48),mat,x,y,z);
 }
 function bar(parent,a,b,width,depth,mat) {
  const start=new THREE.Vector3(...a), end=new THREE.Vector3(...b), axis=end.clone().sub(start);
  const center=start.clone().lerp(end,.5);
  const part=pad(parent,width,axis.length(),depth,.012,mat,center.x,center.y,center.z);
  part.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),axis.normalize());
  return part;
 }
 function seam(parent,points,radius=.0019) {
  const curve = new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  return mesh(parent,new THREE.TubeGeometry(curve,28,radius,6,false),stitch);
 }
 const profile=[[0,0],[.60,0],[.655,.008],[.675,.025],[.675,.047],[.66,.061],[.60,.08],[.51,.10],[.37,.126],[.235,.161],[.19,.182],[0,.182]];
 const pedestal = mesh(fixed,new THREE.LatheGeometry(profile.map(p=>new THREE.Vector2(...p)),96),steel);
 pedestal.name='BronzePedestal';
 const baseEdge = mesh(fixed,new THREE.TorusGeometry(.653,.019,12,96),blackMetal,0,.027,0);
 baseEdge.rotation.x=-Math.PI/2;
 cylinder(fixed,.166,.187,.36,steel,0,.35,0);
 cylinder(fixed,.172,.172,.05,bronze,0,.18,0);
 cylinder(fixed,.117,.117,.19,steel,0,.585,0);
 cylinder(swivel,.18,.153,.061,blackMetal,0,.674,0);
 cylinder(swivel,.235,.19,.047,bronze,0,.72,0);
 bar(swivel,[.16,.69,-.05],[.58,.68,-.05],.026,.026,bronze);
 pad(swivel,.106,.039,.043,.018,blackMetal,.57,.68,-.05);
 pad(swivel,1.22,.12,1.02,.035,blackMetal,0,.766,.13);
 pad(swivel,1.43,.34,1.13,.15,leather,0,.947,.14);
 for (const x of [-.49,.49]) {
  const points = [[x,.912,.707],[x,.967,.707]];
  for (let i=1;i<=8;i++) {
   const angle = i * Math.PI / 16;
   points.push([x,.967+.152*Math.sin(angle),.555+.152*Math.cos(angle)]);
  }
  points.push([x,1.119,.43],[x,1.119,.20],[x,1.119,-.25]);
  seam(swivel,points);
 }
 const back = new THREE.Group();
 back.position.set(0,1.60,-.39);
 back.rotation.x=-.23;
 swivel.add(back);
 pad(back,1.26,1.12,.205,.104,blackMetal,0,0,0);
 pad(back,1.22,1.11,.20,.099,leather,0,0,.048);
 for(const x of [-.42,.42]) seam(back,[[x,-.49,.138],[x,-.22,.149],[x,.10,.149],[x,.37,.149],[x,.50,.131]]);
 seam(back,[[-.42,.105,.149],[-.25,.14,.150],[0,.145,.150],[.25,.14,.150],[.42,.105,.149]]);
 bar(swivel,[-.19,2.12,-.49],[-.19,2.31,-.54],.046,.046,steel);
 bar(swivel,[.19,2.12,-.49],[.19,2.31,-.54],.046,.046,steel);
 const head=pad(swivel,.62,.30,.265,.085,leather,0,2.38,-.51);
 head.rotation.x=-.19;
 for (const side of [-1,1]) {
  const x=side*.744;
  pad(swivel,.19,.10,.94,.04,bronze,x,1.37,.09);
  pad(swivel,.177,.096,.90,.044,leather,x,1.44,.09);
  bar(swivel,[x,.82,.52],[x,1.34,.44],.083,.081,blackMetal);
  bar(swivel,[x,.84,-.36],[x,1.34,-.38],.079,.082,bronze);
  pad(swivel,.105,.15,.89,.048,bronze,x,.831,.09);
  const bolt=cylinder(swivel,.027,.027,.016,steel,x+side*.058,.88,-.31);
  bolt.rotation.z=Math.PI/2;
 }
 for (const side of [-1,1]) bar(swivel,[side*.43,.76,.49],[side*.43,.19,.98],.082,.082,steel);
 const legPad=pad(swivel,.76,.52,.115,.036,leather,0,.48,.75);
 legPad.rotation.x=-.69;
 pad(swivel,.96,.095,.44,.038,bronze,0,.178,1.018);
 pad(swivel,.87,.031,.375,.019,blackMetal,0,.229,1.018);
 for(let i=0;i<7;i++) pad(swivel,.80,.011,.012,.005,steel,0,.248,.866+i*.049);
 return {chair,swivel,pedestal};
}
