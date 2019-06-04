var afnd_delegate = (function () {
  var self = null;
  var afnd = null;
  var container = null;
  var dialogDiv = null;
  var stepDiv = null;
  var multDiv = null;
  var dialogActiveConnection = null;
  var emptyLabel = 'ϵ';

  var statusConnectors = [];

  var updateUIForDebug = function(status) {
    if(status === null) return;
    
    $('.current').removeClass('current');

    $.each(statusConnectors, function(index, connection) {
      connection.setPaintStyle(jsPlumb.Defaults.PaintStyle);
    });
    
    var comparisonChar = status.read;
    var curstatus = $('#' + status.state.final).addClass('current');
    var connection = jsPlumb.select({source:status.state.final});
    statusConnectors.push(connection);
    connection.setPaintStyle({strokeStyle:'green'});
    return self;
  };

  var dialogSave = function (update) {
    
    var inputRead = $('#afnd_dialog_readCharTxt').val();
    var inputWrite = $('#afnd2_dialog_readCharTxt').val();
    var inputRLS = $('#afndRL_dialog_readCharTxt').val();
    var inputRead2 = $('#afnd_dialog_readCharTxtP2').val();
    var inputWrite2 = $('#afnd2_dialog_readCharTxtP2').val();
    var inputRLS2 = $('#afndRL_dialog_readCharTxtP2').val();
    var inputRead3 = $('#afnd_dialog_readCharTxtP3').val();
    var inputWrite3 = $('#afnd2_dialog_readCharTxtP3').val();
    var inputRLS3 = $('#afndRL_dialog_readCharTxtP3').val();

    if (inputRead.length > 1) { inputRead = inputRead[0]; }
    if (inputWrite.length > 1) { inputWrite = inputWrite[0]; }
    if (inputRLS.length > 1) { inputRLS = inputRLS[0]; }
    if(inputRLS != 'L' && inputRLS != 'R' && inputRLS != 'S'){
      $('#afndRL_dialog_readCharTxt').focus().select();
      alert('Direção deve ser L, R ou S');
      return;
    }


    tr ={inputRead: inputRead, inputWrite: inputWrite, direction: inputRLS, final: dialogActiveConnection.targetId};
    tr2={inputRead: inputRead2, inputWrite: inputWrite2, direction: inputRLS2, final: dialogActiveConnection.targetId};
    tr3 ={inputRead: inputRead3, inputWrite: inputWrite3, direction: inputRLS3, final: dialogActiveConnection.targetId};
 
    if (afnd.hasTransition(dialogActiveConnection.sourceId, tr, tr2, tr3)) {
      alert(dialogActiveConnection.sourceId + " já existe transição para " + dialogActiveConnection.targetId + " em " + (inputRead || emptyLabel));
      return;
    }
    
    if (update) {
      afnd.removeTransition(dialogActiveConnection.sourceId, dialogActiveConnection.getLabel(), dialogActiveConnection.targetId);
    }
    //dialog={inputRead, write: inputWrite, direction: inputRLS || emptyLabel}
    dialog = "["+inputRead + "," + inputWrite + "," + inputRLS+"]["+inputRead2 + "," + inputWrite2 + "," + inputRLS2+"]["+inputRead3 + "," + inputWrite3 + "," + inputRLS3+"]";
    dialogActiveConnection.setLabel(dialog || emptyLabel);
    afnd.addTransition(dialogActiveConnection.sourceId, tr,tr2,tr3);
    dialogDiv.dialog("close");
  };

  var dialogCancel = function (update) {
    if (!update) { fsm.removeConnection(dialogActiveConnection); }
    dialogDiv.dialog("close");
  };

  var dialogDelete = function () {
    afnd.removeTransition(dialogActiveConnection.sourceId, dialogActiveConnection.getLabel(), dialogActiveConnection.targetId);
    fsm.removeConnection(dialogActiveConnection);
    dialogDiv.dialog("close");
  };

  var dialogClose = function () {
    dialogActiveConnection = null;
  };

  var multDialog = function(){
    console.log("Oi");
  }
  var stepDialog = function () {

    stepDiv = $('<div></div>', { style: 'text-align:center;' });
    $('<label>Fita 1</label>\
    <div id="bulkResultHeader" style="text-align:left;">\
    <span id="fsmDebugInputStatus11" class="fsmStatus">\
      <span class="consumedInput"></span>\
      <span class="currentInput"></span>\
      <span class="futureInput"></span>\
    </span>\
    <span id="fsmDebugInputStatus12" class="fsmStatus">\
      <span class="consumedInput"></span>\
      <span class="currentInput"></span>\
      <span class="futureInput"></span>\
    </span>\
    <span id="fsmDebugInputStatus13" class="fsmStatus">\
      <span class="consumedInput"></span>\
      <span class="currentInput"></span>\
      <span class="futureInput"></span>\
    </span>\
  </div>\
  <label>Fita 2</label>\
  <div id="bulkResultHeader2" style="text-align:left;">\
    <span id="fsmDebugInputStatus21" class="fsmStatus">\
      <span class="consumedInput"></span>\
      <span class="currentInput"></span>\
      <span class="futureInput"></span>\
    </span>\
    <span id="fsmDebugInputStatus22" class="fsmStatus">\
      <span class="consumedInput"></span>\
      <span class="currentInput"></span>\
      <span class="futureInput"></span>\
    </span>\
    <span id="fsmDebugInputStatus23" class="fsmStatus">\
      <span class="consumedInput"></span>\
      <span class="currentInput"></span>\
      <span class="futureInput"></span>\
    </span>\
  </div>\
  <label>Fita 3</label>\
  <div id="bulkResultHeader3" style="text-align:left;">\
    <span id="fsmDebugInputStatus31" class="fsmStatus">\
      <span class="consumedInput"></span>\
      <span class="currentInput"></span>\
      <span class="futureInput"></span>\
    </span>\
    <span id="fsmDebugInputStatus32" class="fsmStatus" style="display:none;">\
      <span class="consumedInput"></span>\
      <span class="currentInput"></span>\
      <span class="futureInput"></span>\
    </span>\
    <span id="fsmDebugInputStatus33" class="fsmStatus" style="display:none;">\
      <span class="consumedInput"></span>\
      <span class="currentInput"></span>\
      <span class="futureInput"></span>\
    </span> </div>').appendTo(stepDiv);

    stepDiv.dialog({
      dialogClass: "no-close",
      autoOpen: false,
      title: 'Passo a Passo',
      height: 400,
      width: 500,
      modal: true,
      open: function () {}
    });
  };
  var makeDialog = function () {
    dialogDiv = $('<div></div>', { style: 'text-align:center;' });
    $('<div></div>', { style: 'font-size:small;' }).html('Deixe em branco para vazio: ' + emptyLabel + '<br />').appendTo(dialogDiv);
    $('<span></span>', { id: 'afnd_dialog_stateA', 'class': 'tranStart' }).appendTo(dialogDiv);
    $('<input />', { id: 'afnd_dialog_readCharTxt', type: 'text', maxlength: 1, style: 'width:30px;text-align:center;' })
      .val(emptyLabel)
      .focusout(function(){
        if($(this).val() == ""){
          $(this).val(emptyLabel);
        }
      })
      .keypress(function (event) {
        if (event.which === $.ui.keyCode.ENTER) { $(this).next(':input').focus().select(); }
      })
      .appendTo(dialogDiv);
    $('<input />', { id: 'afnd2_dialog_readCharTxt', type: 'text', maxlength: 1, style: 'width:30px;text-align:center;' })
      .val(emptyLabel)
      .focusout(function(){
        if($(this).val() == ""){
          $(this).val(emptyLabel);
        }
      })
      .keypress(function (event) {
        if (event.which === $.ui.keyCode.ENTER) { $(this).next(':input').focus().select();  }
      })
      .appendTo(dialogDiv);
    $('<input/>', { id: 'afndRL_dialog_readCharTxt', type: 'text', maxlength: 1, style: 'width:30px;text-align:center;' })
      .val('R')
      .keypress(function (event) {
        if (event.which === $.ui.keyCode.ENTER) { $(this).next(':input').focus().select();  }
      })
      .appendTo(dialogDiv);


      //OPA NOVO CODIGO PARA SEGUNDA PILHA, OPA
      $('<span></span>', { id: 'afnd_dialog_stateA', 'class': 'tranStart' }).appendTo(dialogDiv);
    $('<input />', { id: 'afnd_dialog_readCharTxtP2', type: 'text', maxlength: 1, style: 'width:30px;text-align:center;' })
      .val(emptyLabel)
      .focusout(function(){
        if($(this).val() == ""){
          $(this).val(emptyLabel);
        }
      })
      .keypress(function (event) {
        if (event.which === $.ui.keyCode.ENTER) { $(this).next(':input').focus().select(); }
      })
      .appendTo(dialogDiv);
    $('<input />', { id: 'afnd2_dialog_readCharTxtP2', type: 'text', maxlength: 1, style: 'width:30px;text-align:center;' })
      .val(emptyLabel)
      .focusout(function(){
        if($(this).val() == ""){
          $(this).val(emptyLabel);
        }
      })
      .keypress(function (event) {
        if (event.which === $.ui.keyCode.ENTER) { $(this).next(':input').focus().select();  }
      })
      .appendTo(dialogDiv);
    $('<input/>', { id: 'afndRL_dialog_readCharTxtP2', type: 'text', maxlength: 1, style: 'width:30px;text-align:center;' })
      .val('R')
      .keypress(function (event) {
        if (event.which === $.ui.keyCode.ENTER) { $('afnd_dialog_readCharTxtP2').focus().select(); }
      })
      .appendTo(dialogDiv);



      
      //OPA NOVO CODIGO PARA TERCEIRA PILHA, OPA
      $('<span></span>', { id: 'afnd_dialog_stateA', 'class': 'tranStart' }).appendTo(dialogDiv);
    $('<input />', { id: 'afnd_dialog_readCharTxtP3', type: 'text', maxlength: 1, style: 'width:30px;text-align:center;' })
      .val(emptyLabel)
      .focusout(function(){
        if($(this).val() == ""){
          $(this).val(emptyLabel);
        }
      })
      .keypress(function (event) {
        if (event.which === $.ui.keyCode.ENTER) { $(this).next(':input').focus().select(); }
      })
      .appendTo(dialogDiv);
    $('<input />', { id: 'afnd2_dialog_readCharTxtP3', type: 'text', maxlength: 1, style: 'width:30px;text-align:center;' })
      .val(emptyLabel)
      .focusout(function(){
        if($(this).val() == ""){
          $(this).val(emptyLabel);
        }
      })
      .keypress(function (event) {
        if (event.which === $.ui.keyCode.ENTER) { $(this).next(':input').focus().select();  }
      })
      .appendTo(dialogDiv);
    $('<input/>', { id: 'afndRL_dialog_readCharTxtP3', type: 'text', maxlength: 1, style: 'width:30px;text-align:center;' })
      .val('R')
      .keypress(function (event) {
        if (event.which === $.ui.keyCode.ENTER) { dialogDiv.parent().find('div.ui-dialog-buttonset button').eq(-1).click(); }
      })
      .appendTo(dialogDiv);

    $('<span></span>', { id: 'afnd_dialog_stateB', 'class': 'tranEnd' }).appendTo(dialogDiv);
    $('body').append(dialogDiv);



    dialogDiv.dialog({
      dialogClass: "no-close",
      autoOpen: false,
      title: 'Entre com transição',
      height: 250,
      width: 500,
      modal: true,
      open: function () { dialogDiv.find('afnd_dialog_readCharTxt').focus().select(); }
    });
  };


  return {
    init: function () {
      self = this;
      afnd = new AFND();
      stepDialog();
      makeDialog();
      return self;
    },

    setContainer: function (newContainer) {
      container = newContainer;
      return self;
    },

    fsm: function () {
      return afnd;
    },

    connectionAdded: function (info) {
      dialogActiveConnection = info.connection;
      $('#afnd_dialog_stateA').html(dialogActiveConnection.sourceId + '&nbsp;');
      $('#afnd_dialog_stateB').html('&nbsp;' + dialogActiveConnection.targetId);

      dialogDiv.dialog('option', 'buttons', {
        Cancel: function () { dialogCancel(false); },
        Save: function () { dialogSave(false); }
      }).dialog("open");
    },

    connectionClicked: function (connection) {
      dialogActiveConnection = connection;
      input = dialogActiveConnection.getLabel();
      var text =[];
      var text2 = [];
      var text3 = [];
      text[0] = input.charAt(1);
      text[1] = input.charAt(3);
      text[2] = input.charAt(5);
      text2[0] = input.charAt(8);
      text2[1] = input.charAt(10);
      text2[2] = input.charAt(12);
      text3[0] = input.charAt(15);
      text3[1] = input.charAt(17);
      text3[2] = input.charAt(19);

      $('#afnd_dialog_readCharTxt').val(text[0]);
      $('#afnd2_dialog_readCharTxt').val(text[1]);
      $('#afndRL_dialog_readCharTxt').val(text[2]);
      $('#afnd_dialog_readCharTxtP2').val(text2[0]);
      $('#afnd2_dialog_readCharTxtP2').val(text2[1]);
      $('#afndRL_dialog_readCharTxtP2').val(text2[2]);
      $('#afnd_dialog_readCharTxtP3').val(text3[0]);
      $('#afnd2_dialog_readCharTxtP3').val(text3[1]);
      $('#afndRL_dialog_readCharTxtP3').val(text3[2]);

      dialogDiv.dialog('option', 'buttons', {
        Cancel: function () { dialogCancel(true); },
        Delete: dialogDelete,
        Save: function () { dialogSave(true); }
      }).dialog("open");
    },

    updateUI: updateUIForDebug,

    getEmptyLabel: function () { return emptyLabel; },

    reset: function () {
      afnd = new AFND();
      return self;
    },

    debugStart: function () {
      stepDiv.dialog('option','buttons',{
      Proximo: function(){fsm.debug()},
      Parar: function(){fsm.debugStop();}
      }).dialog("open");;
      return self;
    },

    debugStop: function () {
      $('.current').removeClass('current');
      stepDiv.dialog("close");
      return self;
    },

    serialize: function () {
      // Converte para um formato serializado

      var model = {};
      model.type = 'AFND';
      model.afnd = afnd.serialize();
      model.states = {};
      model.transitions = [];
      $.each(model.afnd.transitions, function (stateA, transition) {
        model.states[stateA] = {};
        $.each(transition, function (character, states) {
          $.each(states, function (index, state) {
            model.states[state.tr1.final] = {};
            model.transitions.push({
              transition:{
                stateA: stateA,
                stateB: state.tr1.final
              },
              tr1: {
                read: (state.tr1.inputRead || emptyLabel),
                write: state.tr1.inputWrite,
                direction: state.tr1.direction,
              },
              tr2: {
                read: (state.tr2.inputRead || emptyLabel),
                write: state.tr2.inputWrite,
                direction: state.tr2.direction,
              },
              tr3:{
                read: (state.tr3.inputRead || emptyLabel),
                write: state.tr3.inputWrite,
                direction: state.tr3.direction,
              }
            });
          });
        });
      });
      var i = 1;
      $.each(model.states, function (index) {
        if (model.afnd.acceptStates.includes(index)) {
          model.states[index].isAccept = true;
        }
        model.states[index].top = 55 + i * 55;
        model.states[index].left = 55 + i * 81;
        i++;
      });
      model.states['q0'] = {};

      return model;
    },

    deserialize: function (model) {
      console.log(model);
      afnd.deserialize(model.afnd);
    },

    multEntradas: function(){
      
    },

    convertAFNDtoAFD: function () {


      var estadosfinais = [];
      var transition = {};
      var obj;
      transition = afnd.getTr();
      estadosfinais = afnd.finais();

      return (AFNDtoAFD(transition, estadosfinais));

    }
  };
}()).init();
