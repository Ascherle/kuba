//"use strict";

var canvas = document.getElementById("renderCanvas");



var createScene = function(){
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = BABYLON.Color3.Purple();

  // Create materials
  var materials = {
    blue: createMat(scene, colors.blue),
    red: createMat(scene, colors.red),
    navy: createMat(scene, colors.navy),
    green: createMat(scene, colors.green),
    yellow: createMat(scene, colors.yellow),
    seaFoam: createMat(scene, colors.seaFoam),
    white: createMat(scene, colors.white),
    orange: createMat(scene, colors.orange),
    purple: createMat(scene, colors.purple),
    gray: createMat(scene, colors.gray)
 }
  scene.defaultMaterial = materials.navy;



  eColor = new BABYLON.Color3(0.5, 0.5, 0.5);

  // Environment
  var hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("/textures/environment.dds", scene);
  hdrTexture.name = "envTex";
  hdrTexture.gammaSpace = false;
  scene.environmentTexture = hdrTexture;

  var skybox = BABYLON.MeshBuilder.CreateBox("skyBox", {size:10000.0}, scene);
  var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
  skyboxMaterial.backFaceCulling = false;
  skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox", scene);
  skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
  skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
  skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  skybox.material = skyboxMaterial;


  class KlappeParent {
    constructor(rotStat) {
      this.rotStat = rotStat;
    }
  }

  var frameRate = 10;
  var prefixPhysics = "physics_"
  var spheresCounter = 8;

  var rad;
  var radPivotParent;

  var bagger;
  var baggerPivotParent;
  var baggerAnimationFlag = 0;
  var baggerGroundTransformNode1;
  var baggerGroundTransformNode1;
  var baggerGround1;
  var baggerGround2;
  var baggerAnimation;
  var rotator1PivotParent;

  var weiche1PivotParent;
  var weiche2PivotParent;
  var weiche3PivotParent;
  var weiche4PivotParent;
  var weiche5PivotParent;

  var klappe1PivotParent;
  var klappe2PivotParent;
  var klappe3PivotParent;
  var klappe4PivotParent;
  var klappe5PivotParent;
  var klappe6PivotParent;
  var klappe7PivotParent;
  var klappe8PivotParent;
  var klappe9PivotParent;

  var trichter;
  var newMesh;

  var camera = new BABYLON.ArcRotateCamera("Camera", 0.4, 1.2, 20, new BABYLON.Vector3(0, -50, 20), scene);
  camera.attachControl(canvas, true);



  var light = new BABYLON.DirectionalLight("dir02", new BABYLON.Vector3(0.2, -1, 0), scene);
  light.position = new BABYLON.Vector3(0, 80, 0);
  light.intensity = .5;


  var ammo = new BABYLON.AmmoJSPlugin(true);
  ammo.setMaxSteps(10);
  ammo.setFixedTimeStep(1 / (40)); // (1/(240));
  scene.enablePhysics(new BABYLON.Vector3(0, -10, 0), ammo);
  let forceFactor = 1;


  function createWindmill()
  {
    // Windrad
    // 1. Geometrie:
    let holder = BABYLON.MeshBuilder.CreateSphere("holder", {diameter: 0.2, segments: 4}, scene);       // Achse
    let wheel = BABYLON.MeshBuilder.CreateSphere("base", {diameterY: 3, diameterZ: 3, diameterX: 3}, scene);   // Rad
    // im Raum
    holder.position.x = 48;
    holder.position.y = -79;
    holder.position.z = -34;
    wheel.position.x = 48;
    wheel.position.y = -79;
    wheel.position.z = -34;
    // Flügel
    let box1 = BABYLON.MeshBuilder.CreateBox("tooth1", {width: 8, height:0.1, depth:3.2}, scene);
    box1.parent = wheel;
    box1.position.x = 0.1;

    let box2 = box1.clone("tooth2");
    box2.position.x = -0.1;

    let box3 = box1.clone("tooth3");
    box3.position.x = 0;
    box3.position.y = 0.1;
    box3.rotation.z = Math.PI / 2;

    box4 = box3.clone("tooth4");
    box4.position.y = -0.1;
    // 2. Windrad Motor Physik
    [box1, box2, box3, box4].forEach((mesh) => {
      mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 0});
    });
      wheel.physicsImpostor = new BABYLON.PhysicsImpostor(wheel, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 10});
    holder.physicsImpostor = new BABYLON.PhysicsImpostor(holder, BABYLON.PhysicsImpostor.SphereImpostor, {mass: 0});
    var joint1 = new BABYLON.HingeJoint({
      mainPivot: new BABYLON.Vector3(0, 0, 0),
      connectedPivot: new BABYLON.Vector3(0, 0, 0),
      mainAxis: new BABYLON.Vector3(-1, 0, 0),
      connectedAxis: new BABYLON.Vector3(0, 0, -1),
      nativeParams: {
      }
    });
    holder.physicsImpostor.addJoint(wheel.physicsImpostor, joint1);
  }


  function meshToPhysic(mesh, prefix)

  {
    if (mesh.name.startsWith(prefix))
    {
      mesh.setParent(null);
      mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.MeshImpostor, {
        mass: 0,
        friction: 0.5,
        restitution: 0.00001
      });
    }
  }

  function rotatorladen(rotatorName)
  {
    var rotator = scene.getMeshByID(rotatorName);
    var rotatorPivotParent = new BABYLON.TransformNode("rotator");
    rotatorPivotParent.position.x = rotator.position.x;
    rotatorPivotParent.position.y = rotator.position.y;
    rotatorPivotParent.position.z = rotator.position.z;
    rotator.setParent(rotatorPivotParent);
    rotatorPivotParent.angle = 0;
    return rotatorPivotParent;
  }

  function weicheladen(weichenName)
  {
    var weiche = scene.getMeshByID(weichenName);
    var weichePivotParent = new BABYLON.TransformNode("weiche");
    weichePivotParent.position.x = weiche.position.x;
    weichePivotParent.position.y = weiche.position.y;
    weichePivotParent.position.z = weiche.position.z;
    weiche.setParent(weichePivotParent);
    weichePivotParent.weichenstellung = 0;
    weichePivotParent.weicheStart = 0;
    weichePivotParent.weicheEnde = -90;
    return weichePivotParent;
  }

  function baggerladen(baggerName)
  {
    var bagger = scene.getMeshByID(baggerName);
    var baggerPivotParent = new BABYLON.TransformNode("bagger");
    baggerPivotParent.position.x = bagger.position.x;
    baggerPivotParent.position.y = bagger.position.y;
    baggerPivotParent.position.z = bagger.position.z;
    bagger.setParent(baggerPivotParent);
    return baggerPivotParent;
  }

  function baggerGroundladen(groundMesh, baggerTransformNode)
  {
    var baggerGround = scene.getMeshByID(groundMesh);
    var groundMeshTransformNode = new BABYLON.TransformNode("groundMesh");
    groundMeshTransformNode.position.x = baggerGround.position.x;
    groundMeshTransformNode.position.y = baggerGround.position.y;
    groundMeshTransformNode.position.z = baggerGround.position.z;
    groundMeshTransformNode.state = 0;
    baggerGround.setParent(groundMeshTransformNode);
    groundMeshTransformNode.setParent(baggerTransformNode);
    return groundMeshTransformNode;
  }

  function klappeladen(klappeName)
  {
    var klappe = scene.getMeshByID(klappeName);
    var klappePivotParent = new BABYLON.TransformNode("klappe");
    klappePivotParent.position.x = klappe.position.x;
    klappePivotParent.position.y = klappe.position.y;
    klappePivotParent.position.z = klappe.position.z;
    klappePivotParent.state = 0;
    klappe.setParent(klappePivotParent);
    return klappePivotParent;
  }



  function baggerGroundRot(baggerGroundTransformNode)
  {
    var startAngle;
    var endAngle;
    var rotateSpeed = 100;
    if(baggerGroundTransformNode.state == 0)
    {
      startAngle = 0;
      endAngle = -20;
      baggerGroundTransformNode.state = 1;
    }
    else
    {
      startAngle = -20;
      endAngle = 0;
      baggerGroundTransformNode.state = 0;
    }
    BABYLON.Animation.CreateAndStartAnimation("BaggerGroundRotation", baggerGroundTransformNode, "rotation.z", 30, rotateSpeed, BABYLON.Tools.ToRadians(startAngle), BABYLON.Tools.ToRadians(endAngle), 0)
  }

  function klappeRot(klappeName)
  {
    var rotateSpeed = 200;
    var startAngle = 0;
    var endAngle = 90;
    if(klappeName.state == 0)
    {
      startAngle = 0;
      endAngle = 180;
      klappeName.state = 1;
    }
    else
    {
      startAngle = 180;
      endAngle = 0;
      klappeName.state = 0;
    }
    BABYLON.Animation.CreateAndStartAnimation("klappeRotation", klappeName, "rotation.z", 30, rotateSpeed, BABYLON.Tools.ToRadians(startAngle), BABYLON.Tools.ToRadians(endAngle), 0)
  }

  function rotatorRotPush(rotatorTransformNode)
  {
    var rotateSpeed = 150;
    var startAngle = rotatorTransformNode.angle;
    var endAngle = startAngle+180;
    BABYLON.Animation.CreateAndStartAnimation("rotatorRotation", rotatorTransformNode, "rotation.x", 30, rotateSpeed, BABYLON.Tools.ToRadians(startAngle), BABYLON.Tools.ToRadians(endAngle), 0)
    rotatorTransformNode.angle = rotatorTransformNode.angle+180;
  }

  function weicheRot(weichePivotParent, angle)
  {
    var rotateSpeed = 100;
    var startAngle;
    var endAngle;

    if (weichePivotParent.weichenstellung == 0) {
      startAngle = 0;
      endAngle = angle;
      weichePivotParent.weichenstellung = 1;
    } else {
      startAngle = angle;
      endAngle = 0;
      weichePivotParent.weichenstellung = 0;
    }
    BABYLON.Animation.CreateAndStartAnimation("weicheRotation", weichePivotParent, "rotation.y", 30, rotateSpeed, BABYLON.Tools.ToRadians(startAngle), BABYLON.Tools.ToRadians(endAngle), 0)
  }


  // importiere
  BABYLON.SceneLoader.ImportMesh("", "scenes/", "MarbleScene.glb", scene, function(meshList)
  {
    for (i = 0; i < meshList.length; i++)
    {
        meshToPhysic (meshList[i], prefixPhysics);
    }
    weiche1PivotParent = weicheladen("physics_Weiche1");
    weiche2PivotParent = weicheladen("physics_Weiche2");
    weiche3PivotParent = weicheladen("physics_Weiche3");
    weiche4PivotParent = weicheladen("physics_Weiche4");
    weiche5PivotParent = weicheladen("physics_Weiche5");
    klappe1PivotParent = klappeladen("physics_Klappe1");
    klappe2PivotParent = klappeladen("physics_Klappe2");
    klappe3PivotParent = klappeladen("physics_Klappe3");
    klappe4PivotParent = klappeladen("physics_Klappe4");
    klappe5PivotParent = klappeladen("physics_Klappe5");
    klappe6PivotParent = klappeladen("physics_Klappe6");
    klappe7PivotParent = klappeladen("physics_Klappe7");
    klappe8PivotParent = klappeladen("physics_Klappe8");
    klappe9PivotParent = klappeladen("physics_Klappe9");
    rotator1PivotParent = rotatorladen("physics_Rotator");
    baggerPivotParent = baggerladen("physics_Arm");
    baggerGroundTransformNode1 = baggerGroundladen("physics_ArmPlate1", baggerPivotParent);
    baggerGroundTransformNode2 = baggerGroundladen("physics_ArmPlate2", baggerPivotParent);
    createWindmill();
  });


  // Ego Kugelkanone (Create spheres to be thrown)
  function createSpheres(counter)
  {
    var throwSpheres = [];
    var sphereIndex = 0;
    var kugelgroesse = 0.7;
    for (var i = 0; i < counter; i++) {
      var sphere = BABYLON.Mesh.CreateSphere("sphereMetal", 16, kugelgroesse, scene);
      sphere.material = materials.blue;
	  if (i>6)
		 sphere.material=materials.red;
     if (i==1)
 		 sphere.material=materials.green;
	  if (i==2)
		 sphere.material=materials.yellow;
	  if (i==3)
		  sphere.material=materials.purple;
    if (i==4)
  		  sphere.material=materials.orange;
    if (i > 4 && i < 6)
    		 sphere.material=materials.purple;
      sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {
        mass: 1.8, //1.8
        friction: .5,
        restitution: 0.00001
      }, scene);

      throwSpheres.push(sphere);
    }
  }

  //createSpheres(8);


  //  Rotation Animation
  var yRot = new BABYLON.Animation("yRot", "rotation.z", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT);
  var keyFramesR = [];
  keyFramesR.push({
    frame: 0,
    value: 0
  });
  keyFramesR.push({
    frame: frameRate,
    value: 2 * Math.PI
  });
  yRot.setKeys(keyFramesR);


  // Tasten Einlesen
  document.body.onkeyup = function(e) {
    // Animation für weiche1 (Turn)
    if (e.keyCode == 84) //taste 1
    {
      weicheRot(weiche1PivotParent, -90);
    }
    // Animation für weiche2 (tuRn)
    if (e.keyCode == 82) //taste R
    {
      weicheRot(weiche2PivotParent, -30);
    }
    // Animation für weiche3 (tUrn)
    if (e.keyCode == 85) //taste 3
    {
      weicheRot(weiche3PivotParent, 30);
    }
    // Animation für weiche4 (turN)
    if (e.keyCode == 78) //taste N
    {
      weicheRot(weiche4PivotParent, -90);
    }
    // Animation für weiche5 (unsichtbar)
    if (e.keyCode == 66) //taste B
    {
      weicheRot(weiche5PivotParent, 30);
    }
    //Klappe oeffnen
    if (e.keyCode == 72) //taste H
    {
      rotatorRotPush(rotator1PivotParent);
    }
    //Kugeln erzeugen
    if (e.keyCode == 77) //taste M
    {
      createSpheres(spheresCounter);
    }
    //Animation für Klappe1
    if (e.keyCode == 49) //taste 1
    {
      klappeRot(klappe1PivotParent);
    }
    //Animation für Klappe2
    if (e.keyCode == 50) //taste 2
    {
      klappeRot(klappe2PivotParent);
    }
    //Animation für Klappe3
    if (e.keyCode == 51) //taste 3
    {
      klappeRot(klappe3PivotParent);
    }
    //Animation für Klappe4
    if (e.keyCode == 52) //taste 4
    {
      klappeRot(klappe4PivotParent);
    }
    //Animation für Klappe5
    if (e.keyCode == 53) //taste 5
    {
      klappeRot(klappe5PivotParent);
    }
    //Animation für Klappe6
    if (e.keyCode == 54) //taste 6
    {
      klappeRot(klappe6PivotParent);
    }
    //Animation für klappe7
    if (e.keyCode == 55) //taste 7
    {
      klappeRot(klappe7PivotParent);
    }
    //Animation für Klappe8
    if (e.keyCode == 56) //taste 8
    {
      klappeRot(klappe8PivotParent);
    }
    //Animation für Klappe9
    if (e.keyCode == 57) //taste 9
    {
      klappeRot(klappe9PivotParent);
    }
    // Animation für Bagger
    if (e.keyCode == 32) //taste space
    {
      if (baggerAnimationFlag == 0)
	  {
        baggerAnimationFlag = 1;
		if (baggerAnimation == null)
		{
			rotateSpeed = 850;  // kleiner ist schneller
			baggerAnimation = BABYLON.Animation.CreateAndStartAnimation("baggerRotation", baggerPivotParent, "rotation.x", 30, rotateSpeed, BABYLON.Tools.ToRadians(0), BABYLON.Tools.ToRadians(360), BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE)
        }
        else
        {
			baggerAnimation._paused = false;
		}
	  }
	  else
	  {
		  baggerAnimation._paused = true;
		  baggerAnimationFlag = 0;
      }
    }
    /*if (e.keyCode == 72) //taste h
    {
      baggerGroundRot(baggerGroundTransformNode1);
      baggerGroundRot(baggerGroundTransformNode2);
    }*/
    //Funktioniert in Theorie, aber Physik Engine akzeptiert kein mehrfaches Parenting
    //Mesh dreht sich, aber Physik Engine nimmt alte Position an
  }



  // GUI
    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    var checkbox = new BABYLON.GUI.Checkbox();
    checkbox.width = "20px";
    checkbox.height = "20px";
    checkbox.isChecked = true;
    checkbox.color = "gray";
    checkbox.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    checkbox.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    checkbox.top = 20;
    checkbox.left = 20;
    checkbox.onIsCheckedChangedObservable.add(function(value)
    {
        // text1 ein aus
        if (text1.isVisible)
        {
            text1.isVisible = false;
        }
        else
        {
            text1.isVisible = true;
        }
    });
    advancedTexture.addControl(checkbox);

    var text1 = new BABYLON.GUI.TextBlock();
    text1.left = 20;
    text1.top = 40;
    text1.text = "New Marbles: M\nStart/Stop marble transport: SPACE\nOpen Hatch: H\nChange Railway Switches: T,U,R,N\nChange Railway Switch in Tunnel: B\nOpen Trapdoor 1-9:\n1,2,3,4,5,6,7,8,9";
    text1.color = "black";
    text1.fontSize = 24;
    text1.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    text1.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    advancedTexture.addControl(text1);


  return scene;
}


// vordefinierte Farben
var colors = {
  seaFoam: BABYLON.Color3.FromHexString("#16a085"),
  green: BABYLON.Color3.FromHexString("#27ae60"),
  blue: BABYLON.Color3.FromHexString("#2980b9"),
  purple: BABYLON.Color3.FromHexString("#8e44ad"),
  navy: BABYLON.Color3.FromHexString("#2c3e50"),
  yellow: BABYLON.Color3.FromHexString("#f39c12"),
  orange: BABYLON.Color3.FromHexString("#d35400"),
  red: BABYLON.Color3.FromHexString("#c0392b"),
  white: BABYLON.Color3.FromHexString("#bdc3c7"),
  gray: BABYLON.Color3.FromHexString("#7f8c8d")
}
// vordefinierte Materialien
var createMat = (scene, color) => {
  var mat = new BABYLON.StandardMaterial("", scene);
  mat.diffuseColor = color;
  mat.specularColor = BABYLON.Color3.FromHexString("#555555");
  mat.specularPower = 1;
  mat.emissiveColor = color.clone().scale(0.7);
  mat.backFaceCulling = false;
  return mat;
}




//scene = createScene();
__createScene = createScene;

var engine = new BABYLON.Engine(canvas, true, {
  preserveDrawingBuffer: true,
  stencil: true
});
var scene = createScene();

engine.runRenderLoop(function() {
  if (scene) {
    scene.render();
  }
});

// Resize
window.addEventListener("resize", function() {
  engine.resize();
});
