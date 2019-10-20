Function.prototype.member = function(name, value){
	this.prototype[name] = value
}

//////// Game Definition
function Game(){}

Game.start = function(room, welcome){
	game.start(room.id)
	printMessage(welcome)
}

Game.end = function(){
	game.clear()
}

Game.move = function(room){
	game.move(room.id)	
}

Game.handItem = function(){
	return game.getHandItem()
}


//////// Room Definition

function Room(name, background){
	this.name = name
	this.background = background
	this.id = game.createRoom(name, background)
}
Room.member('setRoomLight', function(intensity){
	this.id.setRoomLight(intensity)
})

//////// Object Definition

function Object(room, name, image){
	this.room = room
	this.name = name
	this.image = image

	if (room !== undefined){
		this.id = room.id.createObject(name, image)
	}
}
Object.STATUS = { OPENED: 0, CLOSED: 1, LOCKED: 2 }

Object.member('setSprite', function(image){
	this.image = image
	this.id.setSprite(image)
})
Object.member('resize', function(width){
	this.id.setWidth(width)
})
Object.member('setDescription', function(description){
	this.id.setItemDescription(description)
})

Object.member('getX', function(){
	return this.id.getX()
})
Object.member('getY', function(){
	return this.id.getY()
})
Object.member('locate', function(x, y){
	this.room.id.locateObject(this.id, x, y)
})
Object.member('move', function(x, y){
	this.id.moveX(x)
	this.id.moveY(y)
})

Object.member('show', function(){
	this.id.show()
})
Object.member('hide', function(){
	this.id.hide()
})
Object.member('open', function(){
	this.id.open()
})
Object.member('close', function(){
	this.id.close()
})
Object.member('lock', function(){
	this.id.lock()
})
Object.member('unlock', function(){
	this.id.unlock()
})
Object.member('isOpened', function(){
	return this.id.isOpened()
})
Object.member('isClosed', function(){
	return this.id.isClosed()
})
Object.member('isLocked', function(){
	return this.id.isLocked()
})
Object.member('pick', function(){
	this.id.pick()
})
Object.member('isPicked', function(){
	return this.id.isPicked()
})





//////// Door Definition

function Door(room, name, closedImage, openedImage, connectedTo){
	Object.call(this, room, name, closedImage)

	// Door properties
	this.closedImage = closedImage
	this.openedImage = openedImage
	this.connectedTo = connectedTo
}
// inherited from Object
Door.prototype = new Object()

Door.member('onClick', function(){
	if (!this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}
	else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}
		else {
			Game.end()
		}
	}
})

Door.member('onOpen', function(){
	this.id.setSprite(this.openedImage)
})
Door.member('onClose', function(){
	this.id.setSprite(this.closedImage)
})


//////// Keypad Definition

function Keypad(room, name, image, password, callback){
	Object.call(this, room, name, image)

	// Keypad properties
	this.password = password
	this.callback = callback

}
// inherited from Object
Keypad.prototype = new Object()



//////// DoorLock Definition
function DoorLock(room, name, image, password, door, message){
	Keypad.call(this, room, name, image, password, function(){
		printMessage(message)
		door.unlock()
	})
}
// inherited from Object
DoorLock.prototype = new Keypad()

/////// Item Definition

function Item(room, name, image){
	Object.call(this, room, name, image)
}
// inherited from Object
Item.prototype = new Object()

Item.member('onClick', function(){
	this.id.pick()
})

Item.member('isHanded', function(){
	
	return Game.handItem() == this.id
})





//////////////////////////////////////////////////////////////////////////////////////////////////////////////////






room1 = new Room('room1', '배경-1.png')		// 변수명과 이름이 일치해야 한다.
room2 = new Room('room2', '배경-4.png')		// 변수명과 이름이 일치해야 한다.
room3 = new Room('room3', '배경-3.png')		// 변수명과 이름이 일치해야 한다.

room1.door1 = new Door(room1, 'door1', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png', room2)
room1.door1.resize(120)
room1.door1.locate(1000, 312)

room1.door1.onClick = function(){
	if (room1.key1.isHanded() && !this.id.isLocked() && this.id.isClosed()){
		this.id.open()
	}else if (this.id.isLocked() && this.id.isClosed()){
		printMessage("문이 잠겨있다.")
	}else if (this.id.isOpened()){
		if (this.connectedTo !== undefined){
			Game.move(this.connectedTo)
		}else {
			Game.end()
		}
	}
}


room1.bed1 = new Object(room1, 'bed1', '침대-2.png')
room1.bed1.resize(500)
room1.bed1.locate(250,400)


room1.bed1.onDrag = function(direction){
	this.id.move = true
	if(direction == "Right" && this.id.move){
		printMessage("침대가 밀린다....?")
		room1.bed1.move(200, -40)
		room1.key1.show()
		this.id.move = false
	}else {
		printMessage("움직이지 않는다...")
	}
}

room1.key1 = new Item(room1, 'key1', '열쇠.png')
room1.key1.resize(35)
room1.key1.locate(250, 450)
room1.key1.hide()
room1.key1.onClick = function(){
	this.id.pick()
	printMessage("키를 챙겼다.")
}

room1.box1 = new Object(room1, 'box1', '상자3-닫힘.png')
room1.box1.resize(100)
room1.box1.locate(600,600)
room1.box1.onClick = function(){
	this.id.setSprite("상자3-열림.png")
	printMessage("아무것도 없다...")
}


room1.table1 = new Object(room1, 'table1', '테이블2-1.png')
room1.table1.resize(200)
room1.table1.locate(500,500)



room1.cabinet1 = new Object(room1, 'cabinet1', '캐비닛-오른쪽-닫힘.png')
room1.cabinet1.resize(100)
room1.cabinet1.locate(600,300)
room1.cabinet1.onClick = function(){
	room1.cabinet1.setSprite('캐비닛-오른쪽-열림.png')
	printMessage("포스트잇이 보인다")
	room1.postIt1.show()
}


room1.postIt1 = new Object(room1, 'postIt1', '포스트잇.png')
room1.postIt1.resize(20)
room1.postIt1.locate(590, 300)
room1.postIt1.onClick = function(){
	showImageViewer( "포스트잇.png", "포스트잇.txt")
}
room1.postIt1.hide()

room1.cup1 = new Object(room1, 'cup1', '컵-닫힘.png')
room1.cup1.resize(20)
room1.cup1.locate(510, 450)
room1.cup1.onClick = function(){
	room1.cup1.setSprite("컵-열림.png")
	printMessage("딱히 특별한 건 없다...아직 커피가 따듯하다")
}


room1.cookie1 = new Item(room1, 'cookie1', '쿠키.png')
room1.cookie1.resize(20)
room1.cookie1.locate(470, 460)
room1.cookie1.onClick = function(){
	room1.cookie1.pick()
	printMessage("쿠키를 챙겼다.")
}



///////////////////////////////////////////////////////////////

room2.door1 = new Door(room2, 'door1', '문-왼쪽-닫힘.png', '문-왼쪽-열림.png', room1)
room2.door1.resize(120)
room2.door1.locate(300, 270)

room2.door2 = new Door(room2, 'door2', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png', room3)
room2.door2.resize(120)
room2.door2.locate(1000, 305)
room2.door2.hide()

room2.keypad1 = new Keypad(room2, 'keypad1', '키패드-우.png', '7714', function(){
	printMessage('문이 갑자기 나타났다!')
	room2.door2.show()
})
room2.keypad1.resize(20)
room2.keypad1.locate(920, 250)


// onClick 함수를 재정의할 수도 있다
room2.keypad1.onClick = function(){
	printMessage('비밀번호를 입력해야 하는 것 같다...참고해볼 것이 있을까?')
	showKeypad('number', this.password, this.callback)
}


room2.tv1 = new Object(room2, 'tv1','TV2-2.png')
room2.tv1.resize(200)
room2.tv1.locate(700,300)


room2.rem1 = new Item(room2, 'rem1','리모컨.png')
room2.rem1.resize(50)
room2.rem1.locate(1270,600)
room2.rem1.onClick = function(){
	room2.rem1.pick()
	printMessage("리모컨을 얻었다!")
}


room2.tv1.onClick = function(){
	if(room2.rem1.isHanded() ){
		playYoutube("https://www.youtube.com/watch?v=qZgL8MqqNiE")
		printMessage("TV가 켜졌다!.")
	} else {
		printMessage("TV 전원을 직접 켤 수는 없는 것 같다... 이상한 티비인데?")
	}
}


room2.carp1 = new Object(room2, 'carp1','카펫.png')
room2.carp1.resize(350)
room2.carp1.locate(700,650)


room2.plant1 = new Object(room2, 'plant1','식물2-1.png')
room2.plant1.resize(500)
room2.plant1.locate(900,650)
room2.plant1.onClick = function(){
	printMessage("특별한 건 없는 화단이다.")
}

room2.sofa1 = new Object(room2, 'sofa1','소파.png')
room2.sofa1.resize(550)
room2.sofa1.locate(200,500)
room2.sofa1.onClick = function(){
	printMessage("밀기에는 너무 크다...")
}


/////////////////////////////////////////



room3.door1 = new Door(room3, 'door1', '문-왼쪽-닫힘.png', '문-왼쪽-열림.png', room2)
room3.door1.resize(120)
room3.door1.locate(300, 297)

room3.door2 = new Door(room3, 'door2', '문-오른쪽-닫힘.png', '문-오른쪽-열림.png')
room3.door2.resize(120)
room3.door2.locate(1000, 313)
room3.door2.lock()

room3.lock1 = new DoorLock(room3, 'lock1', '키패드-우.png', '1920', room3.door2, '철커덕')
room3.lock1.resize(20)
room3.lock1.locate(920, 250)
room3.lock1.onClick = function(){
	printMessage('같은 비밀번호는 아닐 것 같다.. 참고해볼 것이 있을까?')
	showKeypad('number', this.password, this.callback)
}

room3.chair1 = new Object(room3, 'chair1','라운지2-1.png')
room3.chair1.resize(400)
room3.chair1.locate(870,500)

room3.chair2 = new Object(room3, 'chair2','라운지2-2.png')
room3.chair2.resize(400)
room3.chair2.locate(400,500)

room3.note1 = new Object(room3, 'note1', '노트.png')
room3.note1.resize(80)
room3.note1.locate(500, 500)
room3.note1.onClick = function(){
	showImageViewer( "노트.png", "노트.txt")
}


Game.start(room1, '방탈출에 오신 것을 환영합니다!')