class SceneA extends Phaser.Scene{
    buttonLogin;
    buttonRegister;

    constructor(){
        super({key: 'SceneA', active: true});
    }

    preload(){
        // Cargar todas la imágenes
        this.load.image('sky', 'assets/sky.png');
        this.load.image('bgLogin', 'assets/login2.png');
        //Imágenes de los botones
        this.load.image('buttonLogin', 'assets/btn-login.png');
        this.load.image('DownButtonLogin', 'assets/btn-login-dark.png');
        this.load.image('buttonRegister', 'assets/btn-register.png');
        this.load.image('downButtonRegister', 'assets/btn-register-dark.png');
    }

    create(){
        this.add.image(400, 300, 'sky');
        var bgLogin = this.add.image(375, 150, 'bgLogin');    //Mostrando la imágen de fondo
        bgLogin.setScale(2) //El tamaño del botón será el doble de la imágen original

        this.buttonLogin = this.add.sprite((game.config.width / 2) - 52.5, game.config.height - 200, 'buttonLogin').setInteractive();   //Convertirlo a imágen intrectiva
        this.buttonRegister = this.add.sprite((game.config.width / 2) - 52.5, game.config.height - 100, 'buttonRegister').setInteractive();

        // Botón identificación de usuario
        this.buttonLogin.on('pointerover', function (event) { game.canvas.style.cursor = "pointer"; });
        this.buttonLogin.on('pointerout', function (event) { game.canvas.style.cursor = "default"; });
        this.buttonLogin.on('pointerdown', 
            () => {
                this.buttonLogin = this.add.sprite((game.config.width / 2) - 52.5, game.config.height - 200, 'DownButtonLogin');    //Muestra el dibujo del botón presionado
            }
        ); 
        this.buttonLogin.on('pointerup', 
            () => {
                let txtEmail = document.getElementById('txt-email');    //Obteneiendo email 
                let txtPwd = document.getElementById('txt-password');   //Obteneiendo la comtraseña
                let img = document.getElementById('img-show-password');
                this.buttonLogin = this.add.sprite((game.config.width / 2) - 52.5, game.config.height - 200, 'buttonLogin');
                this.buttonRegister = this.add.sprite((game.config.width / 2) - 52.5, game.config.height - 100, 'buttonRegister').setInteractive();
                this.loguear(txtEmail, txtPwd, img); //Identificar usuario
            }
        ); 

        //Botón registrar nuevo usuario
        this.buttonRegister.on('pointerover', function (event) { game.canvas.style.cursor = "pointer"; });
        this.buttonRegister.on('pointerout', function (event) { game.canvas.style.cursor = "default"; });
        this.buttonRegister.on('pointerdown', 
            () => {
                this.buttonRegister = this.add.sprite((game.config.width / 2) - 52.5, game.config.height - 100, 'downButtonRegister');
            }
        ); 
        this.buttonRegister.on('pointerup', 
            () => {
                let txtEmail = document.getElementById('txt-email');
                let txtPwd = document.getElementById('txt-password');
                let img = document.getElementById('img-show-password');
                this.buttonRegister = this.add.sprite((game.config.width / 2) - 52.5, game.config.height - 100, 'buttonRegister').setInteractive();
                this.registrarUsuario(txtEmail, txtPwd, img);
            }
        ); 
    }


    loguear(txtEmail, txtPwd, img){
        //Identificando usuario
        let email = txtEmail.value;
        let password = txtPwd.value;
        let validacion = this.validaDatos(email, password);
        if(validacion === ''){
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then(user => {
                usuario = firebase.auth().currentUser;
                //Cambia a la pantalla del juego
                this.redireccionarAlJuego(txtEmail, txtPwd, img, "SceneB");
            })
            .catch(function(error) {  // Handle Errors here.      
                alert("Error: " + error.code + ". " + error.message);
            });
        }else{
            alert(validacion);
        }
    }

    registrarUsuario(txtEmail, txtPwd, img){
        // creamos el nuevo usuario
        let email = txtEmail.value;
        let password  =txtPwd.value;
        let validacion = this.validaDatos(email, password)
        if(validacion === ''){
            firebase.auth().createUserWithEmailAndPassword(email, password)
                .then((user) => {
                    usuario = firebase.auth().currentUser; 		
                    this.redireccionarAlJuego(txtEmail, txtPwd, img, "SceneNombre");
                }).catch((error) => {
                    alert('Ocurrió un error al intentar registrar el usuario: ' + error.message);
                });
        }else{
            alert(validacion);
        }
    }

    validaDatos(email, pwd){
        let res = '';
        if(!this.ValidaEmail(email))res = 'Dirección de correo electrónico no es válida.\n';
        if(pwd.trim().length === 0 || pwd.trim().length === 10)res += 'La contraseña debe tener entre 1 y 10 carácteres. Ingresa un contraseña válida.\n'
        return res;
    }


    ValidaEmail(email) {
        var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email);
    }


    redireccionarAlJuego(txtEmail, txtPwd, img, escena){
        txtEmail.style.display = 'none';
        txtPwd.style.display = 'none';
        img.style.display = 'none';
        this.scene.start(escena); 
        this.scene.bringToTop(escena);
    }

    update(time, delta){

    }

    up() {
        console.log('button up', arguments);
    }
    
    over() {
        console.log('button over');
    }
    
    out() {
        console.log('button out');
    }
}
