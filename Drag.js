//�Ϸų���
var Drag = Class.create();
Drag.prototype = {
    //�ϷŶ���
    initialize: function (drag, options) {
        this.Drag = $(drag);//�ϷŶ���
        this._x = this._y = 0;//��¼�������ϷŶ����λ��
        this._marginLeft = this._marginTop = 0;//��¼margin
        //�¼�����(���ڰ��Ƴ��¼�)
        this._fM = BindAsEventListener(this, this.Move);
        this._fS = Bind(this, this.Stop);

        this.SetOptions(options);

        this.Limit = !!this.options.Limit;
        this.mxLeft = parseInt(this.options.mxLeft);
        this.mxRight = parseInt(this.options.mxRight);
        this.mxTop = parseInt(this.options.mxTop);
        this.mxBottom = parseInt(this.options.mxBottom);

        this.LockX = !!this.options.LockX;
        this.LockY = !!this.options.LockY;
        this.Lock = !!this.options.Lock;

        this.onStart = this.options.onStart;
        this.onMove = this.options.onMove;
        this.onStop = this.options.onStop;

        this._Handle = $(this.options.Handle) || this.Drag;
        this._mxContainer = $(this.options.mxContainer) || null;

        this.Drag.style.position = "absolute";
        //͸��
        if (isIE && !!this.options.Transparent) {
            //����ϷŶ���
            with (this._Handle.appendChild(document.createElement("div")).style) {
                width = height = "100%";
                backgroundColor = "#fff";
                filter = "alpha(opacity:0)";
                fontSize = 0;
            }
        }
        //������Χ
        this.Repair();
        addEventHandler(this._Handle, "mousedown", BindAsEventListener(this, this.Start));
    },
    //����Ĭ������
    SetOptions: function (options) {
        this.options = {//Ĭ��ֵ
            Handle: "",//���ô������󣨲�������ʹ���ϷŶ���
            Limit: false,//�Ƿ����÷�Χ����(Ϊtrueʱ�����������,�����Ǹ���)
            mxLeft: 0,//�������
            mxRight: 9999,//�ұ�����
            mxTop: 0,//�ϱ�����
            mxBottom: 9999,//�±�����
            mxContainer: "",//ָ��������������
            LockX: false,//�Ƿ�����ˮƽ�����Ϸ�
            LockY: false,//�Ƿ�������ֱ�����Ϸ�
            Lock: false,//�Ƿ�����
            Transparent: false,//�Ƿ�͸��
            onStart: function () {
            },//��ʼ�ƶ�ʱִ��
            onMove: function () {
            },//�ƶ�ʱִ��
            onStop: function () {
            }//�����ƶ�ʱִ��
        };
        Extend(this.options, options || {});
    },
    //׼���϶�
    Start: function (oEvent) {
        if (this.Lock) {
            return;
        }
        this.Repair();
        //��¼�������ϷŶ����λ��
        this._x = oEvent.clientX - this.Drag.offsetLeft;
        this._y = oEvent.clientY - this.Drag.offsetTop;
        //��¼margin
        this._marginLeft = parseInt(CurrentStyle(this.Drag).marginLeft) || 0;
        this._marginTop = parseInt(CurrentStyle(this.Drag).marginTop) || 0;
        //mousemoveʱ�ƶ� mouseupʱֹͣ
        addEventHandler(document, "mousemove", this._fM);
        addEventHandler(document, "mouseup", this._fS);
        if (isIE) {
            //���㶪ʧ
            addEventHandler(this._Handle, "losecapture", this._fS);
            //������겶��
            this._Handle.setCapture();
        } else {
            //���㶪ʧ
            addEventHandler(window, "blur", this._fS);
            //��ֹĬ�϶���
            oEvent.preventDefault();
        }
        ;
        //���ӳ���
        this.onStart();
    },
    //������Χ
    Repair: function () {
        if (this.Limit) {
            //��������Χ����
            this.mxRight = Math.max(this.mxRight, this.mxLeft + this.Drag.offsetWidth);
            this.mxBottom = Math.max(this.mxBottom, this.mxTop + this.Drag.offsetHeight);
            //�����������������positionΪrelative����Զ�λ�����ڻ�ȡoffset֮ǰ����
            !this._mxContainer || CurrentStyle(this._mxContainer).position == "relative" || CurrentStyle(this._mxContainer).position == "absolute" || (this._mxContainer.style.position = "relative");
        }
    },
    //�϶�
    Move: function (oEvent) {
        //�ж��Ƿ�����
        if (this.Lock) {
            this.Stop();
            return;
        }
        ;
        //���ѡ��
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        //�����ƶ�����
        this.SetPos(oEvent.clientX - this._x, oEvent.clientY - this._y);
    },
    //����λ��
    SetPos: function (iLeft, iTop) {
        //���÷�Χ����
        if (this.Limit) {
            //���÷�Χ����
            var mxLeft = this.mxLeft, mxRight = this.mxRight, mxTop = this.mxTop, mxBottom = this.mxBottom;
            //�����������������������Χ����
            if (!!this._mxContainer) {
                mxLeft = Math.max(mxLeft, 0);
                mxTop = Math.max(mxTop, 0);
                mxRight = Math.min(mxRight, this._mxContainer.clientWidth);
                mxBottom = Math.min(mxBottom, this._mxContainer.clientHeight);
            }
            ;
            //�����ƶ�����
            iLeft = Math.max(Math.min(iLeft, mxRight - this.Drag.offsetWidth), mxLeft);
            iTop = Math.max(Math.min(iTop, mxBottom - this.Drag.offsetHeight), mxTop);
        }
        //����λ�ã�������margin
        if (!this.LockX) {
            this.Drag.style.left = iLeft - this._marginLeft + "px";
        }
        if (!this.LockY) {
            this.Drag.style.top = iTop - this._marginTop + "px";
        }
        //���ӳ���
        this.onMove();
    },
    //ֹͣ�϶�
    Stop: function () {
        //�Ƴ��¼�
        removeEventHandler(document, "mousemove", this._fM);
        removeEventHandler(document, "mouseup", this._fS);
        if (isIE) {
            removeEventHandler(this._Handle, "losecapture", this._fS);
            this._Handle.releaseCapture();
        } else {
            removeEventHandler(window, "blur", this._fS);
        }
        ;
        //���ӳ���
        this.onStop();
    }
};