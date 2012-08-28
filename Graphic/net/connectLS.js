/**
 * Created with JetBrains WebStorm.
 * User: Locke
 * Date: 2012/8/27
 * Time: 上午 10:35
 * To change this template use File | Settings | File Templates.
 */
var Graphic = Graphic || {};
Graphic.connectLS = cc.Class.extend({

    Keys:"",
    onTimer:null,
    onLogin:null,
    Message:[],
    Broad:[],
    Ctrl:[],
    MessageList:[],
    LOGIN:null, MainKey:"", Key:"",
    _BROADCAST:{msg:null, count:1},
    _MESSAGE:{msg:null, count:1},
    _CONTROL:{msg:null, count:1},
    SEND_OK:false,
    _host:null, _port:null, TIMEOUT:0, isConnected:false,
    reader:null,

    ctor:function () {
        //super();

        //連線關閉 or 斷線
        this.addEventListener(Event.CLOSE, this.closeHandler);
        //連線成功
        this.addEventListener(Event.CONNECT, this.connectHandler);
        //傳送成功
        this.addEventListener(Graphic.SocketEvent.SENT, next);

        //no use
        this.addEventListener(IOErrorEvent.IO_ERROR, ioErrorHandler);
        //no use
        this.addEventListener(SecurityErrorEvent.SECURITY_ERROR, securityErrorHandler);
        //接收封包事件
        this.addEventListener(ProgressEvent.SOCKET_DATA, socketDataHandler);

        //延遲時間
        Time = 100;
        onTimer.addEventListener(TimerEvent.TIMER, onTIMER);

    },

    connect:function (host, port) {
        //super.connect(host, port);
        this._host = host;
        this._port = port;
    },

    /*<----------Extension Application---------->*/

    /*
     * Public :
     * */ /*
     * 讀取伺服器上的房間訊息
     * */
    ReadMessage:function () {
        this.reader.addEventListener(Progress.COMPLETE, Reader);
        this.reader.addEventListener(Progress.TRY_AGIAN, Reader);
        this.reader.beginload(Keys);
    },

    /*
     * 讀取儲存的訊息並釋放
     * */


    Login:function (id, _Key, _MainKey) {
        if (!_Key)_Key = "0";
        if (!_MainKey) _MainKey = "0";
        if (id != null) {
            MainKey = _MainKey;
            Key = _Key;
            Keys = "http://" + _host + "/socket/Server/" + MainKey + "/room-" + Key;
            var json = {MK:MainKey, id:id, K:Key};
            LOGIN = JSON.encode(json);
        }
        send("Login");
        this.addEventListener(Graphic.SocketEvent.CONNECT, LOGIN_CONNECT);
        LoginTime = 10;
        onTimer.stop();
        TIMEOUT = 0;
        SEND_OK = false;
    },

    Send:function (message, type, TryCount) {
        if (!TryCount)TryCount = 1;
        switch (type) {
            case "Send":
                Sendto(message, TryCount);
                break;
            case "Private":
                Broadcast(message, TryCount);
                break;
            case "Public":
                break;
            case "Control":
                Control(message, TryCount);
                break;
        }
    },

    Sendto:function (message, TryCount) {
        if (!TryCount)TryCount = 1;
        Message.push({msg:message + "\n", count:TryCount});
    },

    Broadcast:function (message, TryCount) {
        if (!TryCount)TryCount = 1;
        Broad.push({msg:message + "\n", count:TryCount});
    },

    Control:function (message, TryCount) {
        if (!TryCount)TryCount = 1;
        Ctrl.push({msg:message + "\n", count:TryCount});
    },

    /*
     * Private :
     * */

    sendbyBroadcast:function (value) {
        if (tryCount > 2)
            send(value);
        else
            send(value);
        this.addEventListener(Graphic.SocketEvent.CONNECT, BROADCAST_CONNECT);
        this.dispatchEvent(new Graphic.SocketEvent(Graphic.SocketEvent.CONNECT));
    },

    sendbySendto:function (value) {
        if (tryCount > 2)
            send(value);
        else
            send(value);
        this.addEventListener(Graphic.SocketEvent.CONNECT, SEND_CONNECT);
        this.dispatchEvent(new Graphic.SocketEvent(Graphic.SocketEvent.CONNECT));
    },

    send:function (value) {

        try {
            writeUTFBytes(value);
            flush();
            this.dispatchEvent(new Graphic.SocketEvent(Graphic.SocketEvent.SENT));
        }
        catch (e) {

        }
        return null;
    },


    /* <----------System----------> */

    /*
     * Public :
     * */

    /*
     * Private :
     * */
    onLOGIN:function (e) {
        if (onLogin.currentCount >= 30) {
            if (!SEND_OK) {
                this.removeEventListener(Graphic.SocketEvent.CONNECT, LOGIN_CONNECT);
                onLogin.reset();
                onLogin.start();
                Login();
            }
            else {
                onLogin.stop();
            }
        }
        else {
            if (!SEND_OK) {
                SEND_OK = false;
                this.dispatchEvent(new Graphic.SocketEvent(Graphic.SocketEvent.CONNECT));
            }
            else {
                this.removeEventListener(Graphic.SocketEvent.CONNECT, LOGIN_CONNECT);
                onLogin.stop();
            }
        }
    },

    /*
     * 傳輸程序檢查
     * */
    onTIMER:function (e) {
        //檢查是否有等待傳送的資料
        if (Broad.length > 0 && BROADCAST == null) {
            onTimer.reset();
            onTimer.start();
            BROADCAST = Broad.shift();
            sendbyBroadcast();
        }
        else if (Message.length > 0 && MESSAGE == null) {
            onTimer.reset();
            onTimer.start();
            MESSAGE = Message.shift();
            sendbySendto();
        }
        else if (Ctrl.length > 0 && CONTROL == null) {
            onTimer.reset();
            onTimer.start();
            CONTROL = Ctrl.shift();
            sendbySendto("Control");
        }
//傳送失敗 or 逾時
        if ((MESSAGE != null || BROADCAST != null || CONTROL != null) && onTimer.currentCount >= 5) {
            this.removeEventListener(Graphic.SocketEvent.CONNECT, BROADCAST_CONNECT);
            this.removeEventListener(Graphic.SocketEvent.CONNECT, SEND_CONNECT);
            onTimer.reset();
            console.log("Time out.");
            console.log(MESSAGE);
            console.log(BROADCAST);
            console.log(CONTROL);
            if ((CONTROL != null) && tryCount - 1 > 0) {
                tryCount--;
                sendbySendto("Control");
            }
            else if ((MESSAGE != null) && tryCount - 1 > 0) {
                tryCount--;
                sendbySendto();
            }
            else if (BROADCAST != null && tryCount - 1 > 0) {
                tryCount--;
                sendbyBroadcast();
            }
            else {
                MESSAGE = null;
                BROADCAST = null;
            }
            onTimer.start();
        }
    },

    LOGIN_CONNECT:function (e) {
        this.removeEventListener(Graphic.SocketEvent.CONNECT, LOGIN_CONNECT);
        send(LOGIN);
        onLogin.stop();
        onTimer.start();
    },

    BROADCAST_CONNECT:function (e) {
        this.removeEventListener(Graphic.SocketEvent.CONNECT, BROADCAST_CONNECT);
        BROADCAST = send(BROADCAST);
    },

    SEND_CONNECT:function (e) {
        this.removeEventListener(Graphic.SocketEvent.CONNECT, SEND_CONNECT);
        if (MESSAGE != null)
            MESSAGE = send(MESSAGE);
        else
            CONTROL = send(CONTROL);
    },

    /*
     * 傳輸完成
     * */
    next:function (e) {
        SEND_OK = true;
    },

    /*
     * 斷線重連
     * */
    closeHandler:function (event) {
        //Tweener.addTween(this, {time:1, onComplete:this.closeHandler});
        if (TIMEOUT == 0) {
            TIMEOUT = 1;
            onTimer.stop();
            isConnected = false;
            return;
        }
        if (TIMEOUT > 100 || (event == null && isConnected))
            return;
        TIMEOUT++;
        if (!hasEventListener(Event.CONNECT))
            this.addEventListener(Event.CONNECT, this.connectHandler);
        connect(_host, _port);

    },

    /*
     * 連線事件
     * */
    connectHandler:function (event) {
        this.removeEventListener(Event.CONNECT, this.connectHandler);
        //Tweener.removeTweens(this);
        onTimer.start();
        isConnected = true;
        if (LOGIN != null)
            Login();
    },

    ioErrorHandler:function (event) {

    },

    securityErrorHandler:function (event) {

    },

    /*
     * 收到來自Server的封包事件
     * */
    socketDataHandler:function (eventEvent) {
        var str = readUTFBytes(bytesAvailable);
        var split = str.split("\n");
        for (var i = 0; i < split.length; i++) {
            str = split[i];
            str = str.replace("\n", "");
            var split_2 = str.split("");
            str = Converter.Array2String(split_2, 0, split_2.length);
            switch (str) {
                case "OK":
                case "hello":
                case "Hello":
                    if (Key == "0") {
                        console.log("User connect.");
                        this.dispatchEvent(new Graphic.SocketEvent(Graphic.SocketEvent.USER_CONNECT));
                    }
                    else {
                        this.reader.addEventListener(Progress.COMPLETE, Reader);
                        this.reader.addEventListener(Progress.TRY_AGIAN, Reader);
                        this.reader.beginload(Keys);
                    }
                    break;
                case "bye":
                case "Bye":
                    this.dispatchEvent(new Graphic.SocketEvent(Graphic.SocketEvent.USER_LEAVE));
                    console.log("User leave.");
                    break;
                default:
                    if (!isNaN(parseInt(str))) {
                        if (!this.reader.READING) {
                            console.log(str);
                            this.reader.addEventListener(Progress.COMPLETE, Reader);
                            this.reader.addEventListener(Progress.TRY_AGIAN, Reader);
                            this.reader.beginload(Keys + str);
                        }
                        return;
                    }
                    else
                        split = str.split("");
                    str = "";
                    var s = String.fromCharCode(92);
                    for (i = 0; i < split.length; i++)
                        if (split[i] != s) {
                            str += split[i];
                            if (split[i] == "}")
                                break;
                        }
                    MessageList.push(str);
                    this.dispatchEvent(new Graphic.SocketEvent(Graphic.SocketEvent.MESSAGE));

                    break;
            }
        }
    },

    /*
     * phpreader's events
     * */
    Reader:function (e) {
        this.reader.removeEventListener(Progress.COMPLETE, this.Reader);
        this.reader.removeEventListener(Progress.TRY_AGIAN, this.Reader);
        if (e.type == Progress.TRY_AGIAN) {
            console.log("User connect.");
            this.dispatchEvent(new Graphic.SocketEvent(Graphic.SocketEvent.USER_CONNECT));
            return;
        }
        else {

        }
        var Arr = String(this.reader.data).split("\n"), j = 0;
        do
        {
            var str = Arr[j];
            j += 2;
            switch (str) {
                case "Hello":
                    console.log("User connect.");
                    this.dispatchEvent(new Graphic.SocketEvent(Graphic.SocketEvent.USER_CONNECT));
                    break;
                case "Change":
                case "bye":
                case "Bye":
                    this.dispatchEvent(new Graphic.SocketEvent(Graphic.SocketEvent.USER_LEAVE));
                    console.log("User leave.");
                    break;
                case "\n":
                    break;
                default:
                    var split = str.split("");
                    str = "";
                    var s = String.fromCharCode(92);
                    for (var i = 0; i < split.length; i++)
                        if (split[i] != s)
                            str += split[i];
                    if (str != "") {
                        MessageList.push(str);
                        this.dispatchEvent(new Graphic.SocketEvent(Graphic.SocketEvent.MESSAGE));
                    }
                    break;
            }
        } while (j < Arr.length);
    }
})
;
function get formMessage() {
    do
    {
        var string = MessageList.shift();
    } while (string == "");
    return string;
}

/*
 * 設定讀取訊息的延遲時間
 * */
function set Time(value) {

    if (onTimer == null)
        onTimer = new Timer(value);
    else {
        onTimer.stop();
        onTimer.delay = value;
    }
    onTimer.start();
}

/*
 * 設定登入的延遲時間
 * */
function set LoginTime(value) {

    if (onLogin == null) {
        onLogin = new Timer(value);
        onLogin.addEventListener(TimerEvent.TIMER, onLOGIN);
    }
    else {
        onLogin.reset();
        onLogin.delay = value;
    }
    onLogin.start();
}
/*
 * Getter and Setter
 * */

function get tryCount() {
    if (MESSAGE != null)
        return _MESSAGE.count;
    if (BROADCAST != null)
        return _BROADCAST.count;
    if (CONTROL != null)
        return _CONTROL.count;
    return 0;
}

function set tryCount(value) {
    if (MESSAGE != null)
        _MESSAGE.count = value;
    if (BROADCAST != null)
        _BROADCAST.count = value;
    if (CONTROL != null)
        _CONTROL.count = value;
}

function get MESSAGE() {
    return _MESSAGE.msg;
}

function set MESSAGE(value) {
    if (value == null) {
        _MESSAGE.msg = null;
        _MESSAGE.count = 0;
        return;
    }
    _MESSAGE.msg = value.msg;
    _MESSAGE.count = value.count;
}

function get BROADCAST() {
    return _BROADCAST.msg;
}

function set BROADCAST(value) {
    if (value == null) {
        _BROADCAST.msg = null;
        _BROADCAST.count = 0;
        return;
    }
    _BROADCAST.msg = value.msg;
    _BROADCAST.count = value.count;
}

function get CONTROL() {
    return _CONTROL.msg;
}

function set CONTROL(value) {
    if (value == null) {
        _CONTROL.msg = null;
        _CONTROL.count = 0;
        return;
    }
    _CONTROL.msg = value.msg;
    _CONTROL.count = value.count;
}
