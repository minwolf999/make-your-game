// on récupère le conteneur de notre jeu
const world = document.getElementById("GameScreen");

// j'initialise les constantes dans lesquelles qui me servent à stocké les inputs du joueur
const keys = {
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false },
    ArrowUp: { pressed: false },
    ArrowDown: { pressed: false },
    Enter: { pressed: false },
}

// j'initialise un tableau vide pour mes invaders ainsi que pour les missiles sans les mélanger
let invaders = [];
let missilesPlayer = [];
let missilesInvader = [];

// je crée la class du joueur
class Player {
    // j'initialise les variable de base lors de l'apparition du joueur au début de la partie
    constructor() {
        this.name = "player";
        
        this.width = 100;
        this.height = 100;
        this.speed = 10;

        this.lives = 3;
        this.shootCapacity = 1;
        this.score = 0;
        this.level = 1;

        this.image = "image/player.png";

        this.velocity = {
            x: 0,
            y: 0,
        };

        this.position = {
            x: (world.getBoundingClientRect().width - this.width) /2,
            y: world.getBoundingClientRect().height - this.height - 4,
        }
    }

    // je crée une fonction draw lié au joueur qui va crée/déplacer le joueur
    draw() {
        const deplacePlayer = document.getElementById(this.name);
        if (!deplacePlayer) {
            const createPlayer = document.createElement("img");
            
            createPlayer.id = this.name;
            createPlayer.src = this.image;

            createPlayer.style.width = this.width.toString() + "px";
            createPlayer.style.height = this.height.toString() + "px";
            createPlayer.style.position = "absolute";
            createPlayer.style.top = this.position.y.toString() + "px";
            createPlayer.style.left = this.position.x.toString() + "px";

            world.appendChild(createPlayer);
        } else {
            deplacePlayer.style.top = this.position.y.toString() + "px";;
            deplacePlayer.style.left = this.position.x.toString() + "px";
        }
    }

    //je crée une fonction shoot qui va ajouter un missile au tableau de missile du joueur
    shoot() {
        if (missilesPlayer.length < this.shootCapacity) {
            let missile = new MissilePlayer(this);
            missilesPlayer.push(missile);
        }
    }

    // je crée une fonction qui va mettre à jour la position du joueur en fonction des inputs du joueur puis j'appelle la fonction draw pour mettre à jour le visuel
    update() {
        if (this.position.x >= 10 && keys.ArrowLeft.pressed) {
            this.velocity.x = -this.speed;
        } else if (this.position.x + this.width <= world.getBoundingClientRect().width - 13 && keys.ArrowRight.pressed) {
            this.velocity.x = this.speed;
        } else {
            this.velocity.x = 0;
        }

        this.position.x += this.velocity.x
        this.position.y = world.getBoundingClientRect().height - this.height - 4,
        this.draw();
    }
}

// je crée la class des missile du joueur
class MissilePlayer {
    constructor(owner) {
        this.name = "missilePlayer" + Date.now() + '_' + Math.floor(Math.random() * 1000000000);

        this.width = 15;
        this.height = 35;
        this.speed = -20;

        this.image = "image/playerMissile.png";

        this.velocity = {
            x: 0,
            y: 0,
        }

        this.position = {
            x: owner.position.x + owner.width/2 - this.width/2,
            y: owner.position.y + 30,
        }
    }

    draw() {
        let deplaceMissilePlayer = document.getElementById(this.name);
        if (!deplaceMissilePlayer) {
            let createMissile = document.createElement("img");

            createMissile.id = this.name.toString();
            createMissile.src = this.image;

            createMissile.style.width = this.width.toString() + "px";
            createMissile.style.height = this.height.toString() + "px";
            createMissile.style.position = "absolute";
            createMissile.style.top = this.position.y.toString() + "px";
            createMissile.style.left = this.position.x.toString() + "px";

            world.appendChild(createMissile);
        } else {
            deplaceMissilePlayer.style.top = this.position.y.toString() + "px";
            deplaceMissilePlayer.style.left = this.position.x.toString() + "px";
        }
    }

    update(index) {
        if (this.position.y > 0) {
            this.velocity.y = this.speed;

            this.position.y += this.velocity.y;
            this.draw();
        } else {
            const missileInvaderToRemove = document.getElementById(this.name.toString());
            if (missileInvaderToRemove) {
                this.velocity.y = 0;
                missilesPlayer.splice(index, 1);

                world.removeChild(missileInvaderToRemove);
            }
        }
    }
}

// je crée la class des invaders
class Invader {
    constructor(spawnX, spawnY) {
        this.name = "invader" + Date.now() + '_' + Math.floor(Math.random() * 1000000000);

        this.width = 50;
        this.height = 50;
        this.speed = 4;

        this.image = "image/invader.png";

        this.velocity = {
            x: this.speed,
            y: 0,
        }

        this.position = {
            x: spawnX,
            y: spawnY,
        }
    }

    draw() {
        let deplaceInvader = document.getElementById(this.name);
        if (!deplaceInvader) {
            let createInvader = document.createElement("img");

            createInvader.id = this.name
            createInvader.src = this.image;

            createInvader.style.zIndex = 1;

            createInvader.style.width = this.width.toString() + "px";
            createInvader.style.height = this.height.toString() + "px";
            createInvader.style.position = "absolute";
            createInvader.style.top = this.position.y.toString() + "px";
            createInvader.style.left = this.position.x.toString() + "px";

            world.appendChild(createInvader);
        } else {
            

            deplaceInvader.style.top = this.position.y.toString() + "px";
            deplaceInvader.style.left = this.position.x.toString() + "px";
        }
    }

    shoot() {
        let missileInvader = new MissileInvader(this);
        missilesInvader.push(missileInvader);
    }

    update() {
        if (this.position.x + this.velocity.x <= 0 || this.position.x + this.width + this.velocity.x >= world.getBoundingClientRect().width - 4) {
            this.velocity.x = -this.velocity.x;
            this.velocity.y = this.height;
        } else {
            this.velocity.y = 0;
        }

        if (this.velocity.y == 0) {
            this.position.x += this.velocity.x;
        } else {
            this.position.y += this.velocity.y;
            if (this.position.x <= 50) {
                this.position.x = 0;
            } else {
                this.position.x = world.getBoundingClientRect().width - this.width - 4;
            }
        }

        this.draw();
    }
}

// je crée la class des missiles des invaders
class MissileInvader {
    constructor(owner) {
        this.name = "missileInvader" + Date.now() + '_' + Math.floor(Math.random() * 1000000000);

        this.width = 15;
        this.height = 35;
        this.speed = 20;

        this.image = "image/invaderMissile.png";

        this.velocity = {
            x: 0,
            y: 0,
        }

        this.position = {
            x: owner.position.x + owner.width/2 - this.width/2,
            y: owner.position.y + owner.height,
        }
    }

    draw() {
        let deplaceMissileInvader = document.getElementById(this.name);

        if (!deplaceMissileInvader) {
            let createMissileInvader = document.createElement("img");

            createMissileInvader.id = this.name.toString();
            createMissileInvader.src = this.image;

            createMissileInvader.style.width = this.width.toString() + "px";
            createMissileInvader.style.height = this.height.toString() + "px";
            createMissileInvader.style.position = "absolute";
            createMissileInvader.style.top = this.position.y.toString() + "px";
            createMissileInvader.style.left = this.position.x.toString() + "px";

            world.appendChild(createMissileInvader);
        } else {
            deplaceMissileInvader.style.top = this.position.y.toString() + "px";
            deplaceMissileInvader.style.left = this.position.x.toString() + "px";
        }
    }

    update(index) {
        if (this.position.y + this.height + this.speed < world.getBoundingClientRect().height) {
            this.velocity.y = this.speed;

            this.position.y += this.velocity.y;
            this.draw();
        } else {
            const missileInvaderToRemove = document.getElementById(this.name.toString());
            if (missileInvaderToRemove) {
                this.velocity.y = 0;
                missilesInvader.splice(index, 1);

                world.removeChild(missileInvaderToRemove);
            }
        }
    }
}

// j'initialise un joueur et je récupère les informations à afficher à l'écran (pour pouvoir les mettre à jour)
const player = new Player();
const liveScreen = document.getElementById("live");
const scoreScreen = document.getElementById("score");
const timerElement = document.getElementById("timer");
const fpsIndicater = document.getElementById("fps");

// j'initialise la probabilité de tir des invaders ainsi que les variables pouvant mettre en pause le jeu
var levelDifficulty = 1000;
var nextWaveLoadingAnimation = false;
var gameOver = false;
var pauseMenu = false;
var menuSelected = 0;

// je crée la liste d'invaders avec leurs propre coordonnées (le nombre d'invaders change en fonction de la taille de l'écran)
for (let i = 0; i <= (world.getBoundingClientRect().width / 54); i++) {
    let invader = new Invader(i*53, 0); 
    invaders.push(invader);
}

// j'initialise la variable qui va compter les fps, l'affiche toutes les secondes, et la vide
var frameCount = 1;
setInterval(() => {
    fpsIndicater.innerHTML = frameCount + "fps";
    frameCount = 1;
}, 1000);

// j'initialise les variables servant au timer et les met à jour toutes les 0.01 secondes
let timerSeconde = 0;
let timerMinute = 0;
setInterval(augmenterTemps, 10);

const AnimationLoop = () => {
    // je déclare le début des animations (donc une boucle infini qui ne peux être arrêter que par un cancelAnimationFrame())
    request = requestAnimationFrame(AnimationLoop);

    // j'augmente le nombre de frame afficher
    frameCount++;

    // je récupère à chaque frame l'élément écran (dans lequel se déplace les objets) (si jamais le joueur change la taillede la fenêtre)
    const world = document.getElementById("GameScreen");

    // si la variable gameOver à été mis à true j'affiche le menu de gameOver
    if (gameOver) {
        GameOverScreen();
    }

    // si la variable pauseMenu à été mis à true j'enlève tous les éléments de la page puis j'affiche le menu de pause
    if (pauseMenu) {
        for (let child of world.children) {
            world.removeChild(child);
        }
    
        let removePlayerVisual = document.getElementById(player.name);
        if (removePlayerVisual) {
            world.removeChild(removePlayerVisual);
        }
    
        for (let invader of invaders) {
            let removeInverderVisual = document.getElementById(invader.name);
            if (removeInverderVisual) {
                world.removeChild(removeInverderVisual);
            }
        }
    
        for (let missilePlayer of missilesPlayer) {
            let removeMissilePlayerVisual = document.getElementById(missilePlayer.name);
            if (removeMissilePlayerVisual) {
                world.removeChild(removeMissilePlayerVisual);
            }
        }
    
        for (let missileInvader of missilesInvader) {
            let removeMissileInverderVisual = document.getElementById(missileInvader.name);
            if (removeMissileInverderVisual) {
                world.removeChild(removeMissileInverderVisual);
            }
        }

        let modifieMenu = document.getElementById("menu");
        if (!modifieMenu) {
            let createMenu = document.createElement("pre");

            createMenu.id = "menu";

            createMenu.style.textAlign = "center";
            createMenu.style.fontFamily = "serif";
            createMenu.style.fontSize = "18px";
            createMenu.style.color = "white";

            world.appendChild(createMenu);
            modifieMenu = document.getElementById("menu");
        }

        if (menuSelected == 0) {
            modifieMenu.innerHTML = "➤ continue\n  exit";
        } else if (menuSelected == 1) {
            modifieMenu.innerHTML = "  continue\n➤ exit";
        }

        if (keys.ArrowDown.pressed) {
            menuSelected = 1;
        } else if (keys.ArrowUp.pressed) {
            menuSelected = 0;
        }

        // si on valide "continue" j'enlève le menu et pauseMenu repasse à false sinon je recharge la page
        if (keys.Enter.pressed && menuSelected == 0) {
            world.removeChild(modifieMenu);
            pauseMenu = false;
        } else if (keys.Enter.pressed && menuSelected == 1) {
            location.reload();
        }
    }

    // si une des variables pouvant mettre le jeu en pause est à true je return (qui dans ce cas à le même effet qu'un continue dans une boucle)
    if (nextWaveLoadingAnimation || pauseMenu || gameOver) {
        return;
    }

    // si le joueur n'as plus de vie je détruit tous les éléments et met gameOver à true
    if (player.lives <= 0) {
        DeleteAllElement();

        gameOver = true;
        return;
    }

    /*
    pour chaque missile présent dans le tableau de missile du joueur je vérifie si les coordonées correspondent à celui d'un invader et si c'est le cas le 
    score du joueur augmente, je lance une animation d'explosion, et je détruit le missile et l'invader (et l'animation après qu'elle est fini d'être jouer)
    */
    let index2 = 0;
    for (let missilePlayer of missilesPlayer) {
        let index3 = 0;

        missilePlayer.update(index2);

        for (let invader of invaders) {
            if (missilePlayer.position.y + missilePlayer.height < invader.position.y + invader.height &&
                missilePlayer.position.y > invader.position.y - 5 &&
                missilePlayer.position.x < invader.position.x + invader.width &&
                missilePlayer.position.x + missilePlayer.width > invader.position.x) {
                
                player.score += 50;
                scoreScreen.innerHTML = "Scores : " + player.score;

                missilesPlayer.splice(index2, 1);
                invaders.splice(index3, 1);

                if (invaders.length > 0) {
                    let explosionAnimation = document.createElement("img");

                    explosionAnimation.src = "image/explosionInvaderMissile.gif";
                    explosionAnimation.id = "explosion" + Date.now() + '_' + Math.floor(Math.random() * 1000000000);
    
                    explosionAnimation.style.transform = "scaleY(-1)";
                    explosionAnimation.style.zIndex = -1;
    
                    explosionAnimation.style.width = "50px";
                    explosionAnimation.style.height = "50px";
                    explosionAnimation.style.position = "absolute";
                    explosionAnimation.style.top = (missilePlayer.position.y + missilePlayer.height - missilePlayer.speed).toString() + "px";
                    explosionAnimation.style.left = missilePlayer.position.x.toString() + "px";
    
                    world.appendChild(explosionAnimation);
    
                    setTimeout(() => {
                        let removeExplosion = document.getElementById(explosionAnimation.id);
                        if (removeExplosion) {
                            world.removeChild(removeExplosion)
                        }
                    }, 1200);
                }

                let missilePlayerToRemove = document.getElementById(missilePlayer.name.toString());
                if (missilePlayerToRemove) {
                    world.removeChild(missilePlayerToRemove);
                }

                let invaderToRemove = document.getElementById(invader.name.toString());
                world.removeChild(invaderToRemove);
                break;
            }

            index3++;
        }

        index2++;
    }

    // je fais la même chose pour les missiles des invaders
    let index = 0;
    for (let missileInvader of missilesInvader) {
        missileInvader.update(index);

        if (missileInvader.position.y + missileInvader.height <= player.position.y + player.height &&
            missileInvader.position.y >= player.position.y + 5 &&
            missileInvader.position.x >= player.position.x &&
            missileInvader.position.x + missileInvader.width <= player.position.x + player.width) {

            player.lives -= 1;
            liveScreen.innerHTML = "Lives : " + player.lives;

            missilesInvader.splice(index,1);

            let explosionAnimation = document.createElement("img");

            explosionAnimation.src = "image/explosionInvaderMissile.gif";
            explosionAnimation.id = "explosion" + Date.now() + '_' + Math.floor(Math.random() * 1000000000);

            explosionAnimation.style.width = "50px";
            explosionAnimation.style.height = "50px";
            explosionAnimation.style.position = "absolute";
            explosionAnimation.style.top = (missileInvader.position.y - missileInvader.height - missileInvader.speed).toString() + "px";
            explosionAnimation.style.left = missileInvader.position.x.toString() + "px";

            world.appendChild(explosionAnimation);

            setTimeout(() => {
                let removeExplosion = document.getElementById(explosionAnimation.id);
                if (removeExplosion) {
                    world.removeChild(removeExplosion)
                }
            }, 1200);

            let missileInvaderToRemove = document.getElementById(missileInvader.name.toString());
            if (missileInvaderToRemove) {
                world.removeChild(missileInvaderToRemove);
            }
            
            break;
        }

        index++;
    }

    /* 
    j'utilise levelDifficulty pour générer un nombre aléatoir de plus en plus petit au fur et à mesure que l'on avance dans les niveau 
    (donc les invaders on de plus en plus de probabilité de tirer)

    je vérifie aussi si les invaders sont arrivé au niveau du joueur et si c'est le cas je supprime tous les éléments et met gameOver à true
    */
    for (let invader of invaders) {
        const rand = Math.random()*levelDifficulty;
        const randround = Math.round(rand);
        
        if(randround == 1) {
            invader.shoot();
        }

        if (invader.position.y + invader.height > player.position.y) {
            DeleteAllElement();

            gameOver = true;
            return;
        }

        invader.update();
    }

    // je met à jours le joueur
    player.update();

    // s'il n'y a plus d'invader
    if (invaders.length == 0) {
        // je supprime tous les éléments
        DeleteAllElement();

        // j'augmente le niveau et la capacité de tir (le nombre de missile pouvant être présent à l'écran)
        player.level++;
        if (player.shootCapacity < 5) {
            player.shootCapacity++;
        }

        // je met à jour le level afficher à l'écran
        const level = document.getElementById("level");
        level.innerHTML = "Level : " + player.level;

        // je crée mon message d'alert en attendant la nouvelle vague
        let messageAlert = document.createElement("h2");
            
        messageAlert.textContent = "New Wave Is Coming !!!";
        messageAlert.id = "messageAlert";
        messageAlert.style.backgroundColor = `rgba(255, 0, 0, 1)`;
        messageAlert.style.color = "black";
        messageAlert.style.fontFamily = "serif";
        messageAlert.style.fontSize = "22px;"
        messageAlert.style.textAlign = "center";
        messageAlert.style.width = world.getBoundingClientRect().width.toString() + "px";
        messageAlert.style.height = world.getBoundingClientRect().height.toString() + "px";

        world.appendChild(messageAlert);

        // je stocke la date du d"but de l'animation ainsi que l'opacity de base
        const start = Date.now();
        var opacity = 1;

        // je crée une animation qui fait varié l'opacité du message
        const nextWave = () => {
            const next = requestAnimationFrame(nextWave);
            
            const messageUpdateColor = document.getElementById("messageAlert");

            messageUpdateColor.style.width = (world.getBoundingClientRect().width.toString() - 4) + "px";
            messageUpdateColor.style.height = (world.getBoundingClientRect().height.toString() - 4) + "px";
            messageUpdateColor.style.background = `rgba(255, 0, 0, ${opacity})`;
    
            if (Date.now() - start <= 1000) {
                opacity -= 0.015;
            } else if (Date.now() - start <= 2000) {
                opacity += 0.015;
            } else if (Date.now() - start <= 3000) {
                opacity -= 0.015;
            } else if (Date.now() - start <= 4000) {
                opacity += 0.015;
            }
    
            if (Date.now() - start >= 4000) {
                world.removeChild(messageUpdateColor);
                nextWaveLoadingAnimation = false;
                cancelAnimationFrame(next);
            }
        }
        nextWaveLoadingAnimation = true;
        nextWave();

        // je crée une nouvelle vague d'ennemi en ajoutant le niveau du joueur à leur vitesse
        for (let i = 0; i <= (world.getBoundingClientRect().width / 54); i++) {
            let invader = new Invader(i*53, 0);
            invader.velocity.x += player.level;
            invaders.push(invader);            
        }

        // j'augmente la probabilité de tirer
        if (levelDifficulty >= 5) {
            levelDifficulty = levelDifficulty/1.25;
        }
    }
}
AnimationLoop();

// je met en écoute certaines touchent du joueur et met leurs variable à true s'il presse une des touches attendu
addEventListener('keydown', ({ key }) => {
    switch (key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = true;
            break;
        case 'ArrowDown':
            keys.ArrowDown.pressed = true;
            break;
        case 'Enter':
            keys.Enter.pressed = true;
            break;
        case 'Escape':
            pauseMenu = true;
            break;
    }
});

// je met en écoute certaines touchent du joueur et met leurs variable à false s'il relache une des touches attendu
addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowUp':
            keys.ArrowUp.pressed = false;
            break;
        case 'ArrowDown':
            keys.ArrowDown.pressed = false;
            break;
        case 'Enter':
            keys.Enter.pressed = false;
            break;
        case ' ':
            player.shoot();
            break;
    }
});

// les variables gameOver et pauseMenu sont à false j'augmente le temps (je dois arrondir les secondes) et je met à jours le visuel du temps à l'écran
function augmenterTemps() {
    if (!pauseMenu && !gameOver) {
        const roundedDuration = Math.round(timerSeconde * 100) / 100
        if (timerMinute == 0) {
            if (timerSeconde > 1) {
                timerElement.innerText = roundedDuration + " seconds since the start of the game"
            } else {
                timerElement.innerText = roundedDuration + " second since the start of the game"
            }
        } else {
            if (timerMinute > 1 && timerSeconde > 1) {
                timerElement.innerHTML = timerMinute + " minutes and " + roundedDuration + " seconds since the start of the game"
            } else if (timerMinute > 1) {
                timerElement.innerHTML = timerMinute + " minutes and " + roundedDuration + " second since the start of the game"
            } else if (timerSeconde > 1) {
                timerElement.innerHTML = timerMinute + " minute and " + roundedDuration + " seconds since the start of the game"
            } else {
                timerElement.innerHTML = timerMinute + " minute and " + roundedDuration + " second since the start of the game"
            }
        }
        
        if (timerSeconde >= 60) {
            timerSeconde = 0;
            timerMinute++;
        } else {
            timerSeconde += 0.01;
        }
    }
}

// je supprime tous les éléments à l'écran (en les vérifiant 1 par 1 pour ne pas qu'il en reste)
function DeleteAllElement() {
    for (let child of world.children) {
        world.removeChild(child);
    }

    let removePlayerVisual = document.getElementById(player.name);
    if (removePlayerVisual) {
        world.removeChild(removePlayerVisual);
    }

    for (let invader of invaders) {
        let removeInverderVisual = document.getElementById(invader.name);
        if (removeInverderVisual) {
            world.removeChild(removeInverderVisual);
        }
    }
    invaders = [];

    for (let missilePlayer of missilesPlayer) {
        let removeMissilePlayerVisual = document.getElementById(missilePlayer.name);
        if (removeMissilePlayerVisual) {
            world.removeChild(removeMissilePlayerVisual);
        }
    }
    missilesPlayer = [];

    for (let missileInvader of missilesInvader) {
        let removeMissileInverderVisual = document.getElementById(missileInvader.name);
        if (removeMissileInverderVisual) {
            world.removeChild(removeMissileInverderVisual);
        }
    }
    missilesInvader = [];
}

// si gameOver est à true je crée un menu et si le joueur appuie sur entrer je recharge la page
function GameOverScreen() {
    if (gameOver) {
        let endImage = document.getElementById("end");
        let menu = document.getElementById("menu");
        if (!endImage) {
            let createMenu = document.createElement("pre");
            createMenu.id = "menu";

            createMenu.style.textAlign = "center";
            createMenu.style.fontFamily = "serif";
            createMenu.style.fontSize = "18px";
            createMenu.style.color = "white";

            createMenu.innerHTML = `You lost !\nThe world has been destroyed by invaders !\n\n➤ restart`;
            world.appendChild(createMenu);

            let createEndImage = document.createElement("img");
            createEndImage.src = "image/end.gif";
            createEndImage.id = "end";
            createEndImage.style.width = (world.getBoundingClientRect().width - 4).toString() + "px";
            createEndImage.style.height = (world.getBoundingClientRect().height - createMenu.offsetHeight - 4).toString() + "px";

            world.appendChild(createEndImage);
        } else {
            endImage.style.width = (world.getBoundingClientRect().width - 4).toString() + "px";
            endImage.style.height = (world.getBoundingClientRect().height - menu.offsetHeight - 4).toString() + "px";
        }
        
        if (keys.Enter.pressed) {
            location.reload();
        }
    }
}
