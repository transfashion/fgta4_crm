var this_page_id;
var this_page_options;

import {fgta4slideselect} from  '../../../../../index.php/asset/fgta/framework/fgta4libs/fgta4slideselect.mjs'
import * as hnd from  './crmevent-edit-hnd.mjs'

const txt_caption = $('#pnl_edit-caption')


const btn_edit = $('#pnl_edit-btn_edit')
const btn_save = $('#pnl_edit-btn_save')
const btn_delete = $('#pnl_edit-btn_delete')






const pnl_form = $('#pnl_edit-form')
const obj = {
	txt_crmevent_id: $('#pnl_edit-txt_crmevent_id'),
	txt_crmevent_name: $('#pnl_edit-txt_crmevent_name'),
	txt_crmevent_descr: $('#pnl_edit-txt_crmevent_descr'),
	dt_crmevent_dtstart: $('#pnl_edit-dt_crmevent_dtstart'),
	dt_crmevent_dtend: $('#pnl_edit-dt_crmevent_dtend'),
	dt_crmevent_dtaffected: $('#pnl_edit-dt_crmevent_dtaffected'),
	txt_crmevent_message: $('#pnl_edit-txt_crmevent_message'),
	txt_crmevent_registeredmessage: $('#pnl_edit-txt_crmevent_registeredmessage'),
	chk_crmevent_iscommit: $('#pnl_edit-chk_crmevent_iscommit'),
	chk_crmevent_isdisabled: $('#pnl_edit-chk_crmevent_isdisabled'),
	chk_crmevent_isunlimit: $('#pnl_edit-chk_crmevent_isunlimit'),
	chk_crmevent_isclose: $('#pnl_edit-chk_crmevent_isclose'),
	txt_crmevent_targetinvited: $('#pnl_edit-txt_crmevent_targetinvited'),
	txt_crmevent_targetattendant: $('#pnl_edit-txt_crmevent_targetattendant'),
	txt_crmevent_targetnewcontact: $('#pnl_edit-txt_crmevent_targetnewcontact'),
	txt_crmevent_targettx: $('#pnl_edit-txt_crmevent_targettx'),
	txt_crmevent_targettxnew: $('#pnl_edit-txt_crmevent_targettxnew'),
	txt_crmevent_targetbuyer: $('#pnl_edit-txt_crmevent_targetbuyer'),
	txt_crmevent_targetbuyernew: $('#pnl_edit-txt_crmevent_targetbuyernew'),
	txt_crmevent_targetsales: $('#pnl_edit-txt_crmevent_targetsales'),
	txt_crmevent_targetsalesnew: $('#pnl_edit-txt_crmevent_targetsalesnew'),
	txt_crmevent_totalinvited: $('#pnl_edit-txt_crmevent_totalinvited'),
	txt_crmevent_totalattendant: $('#pnl_edit-txt_crmevent_totalattendant'),
	txt_crmevent_totalnewcontact: $('#pnl_edit-txt_crmevent_totalnewcontact'),
	txt_crmevent_totaltx: $('#pnl_edit-txt_crmevent_totaltx'),
	txt_crmevent_totaltxnew: $('#pnl_edit-txt_crmevent_totaltxnew'),
	txt_crmevent_totalbuyer: $('#pnl_edit-txt_crmevent_totalbuyer'),
	txt_crmevent_totalbuyernew: $('#pnl_edit-txt_crmevent_totalbuyernew'),
	txt_crmevent_totalsales: $('#pnl_edit-txt_crmevent_totalsales'),
	txt_crmevent_totalsalesnew: $('#pnl_edit-txt_crmevent_totalsalesnew'),
	cbo_crmsource_id: $('#pnl_edit-cbo_crmsource_id')
}




let form;
let rowdata;

export async function init(opt) {
	this_page_id = opt.id;
	this_page_options = opt;

	txt_caption.template = txt_caption.html();
	var disableedit = false;


	form = new global.fgta4form(pnl_form, {
		primary: obj.txt_crmevent_id,
		autoid: true,
		logview: 'trn_crmevent',
		btn_edit: disableedit==true? $('<a>edit</a>') : btn_edit,
		btn_save: disableedit==true? $('<a>save</a>') : btn_save,
		btn_delete: disableedit==true? $('<a>delete</a>') : btn_delete,		
		objects : obj,
		OnDataSaving: async (data, options) => { await form_datasaving(data, options) },
		OnDataSaveError: async (data, options) => { await form_datasaveerror(data, options) },
		OnDataSaved: async (result, options) => {  await form_datasaved(result, options) },
		OnDataDeleting: async (data, options) => { await form_deleting(data, options) },
		OnDataDeleted: async (result, options) => { await form_deleted(result, options) },
		OnIdSetup : (options) => { form_idsetup(options) },
		OnViewModeChanged : (viewonly) => { form_viewmodechanged(viewonly) },
		OnRecordStatusCreated: () => {
			undefined			
		}		
	});
	form.getHeaderData = () => {
		return getHeaderData();
	}

	// Generator: Print Handler not exist
	// Generator: Commit Handler not exist
	// Generator: Approval Handler not exist
	// Generator: Xtion Handler not exist
	// Generator: Object Handler not exist

	// Generator: Upload Handler not exist


	obj.cbo_crmsource_id.name = 'pnl_edit-cbo_crmsource_id'		
	new fgta4slideselect(obj.cbo_crmsource_id, {
		title: 'Pilih crmsource_id',
		returnpage: this_page_id,
		api: $ui.apis.load_crmsource_id,
		fieldValue: 'crmsource_id',
		fieldDisplay: 'crmsource_name',
		fields: [
			{mapping: 'crmsource_id', text: 'crmsource_id'},
			{mapping: 'crmsource_name', text: 'crmsource_name'}
		],
		OnSelected: (value, display, record, args) => {
			if (value!=args.PreviousValue ) {
				if (typeof hnd.cbo_crmsource_id_selected === 'function') {
					hnd.cbo_crmsource_id_selected(value, display, record, args);
				}
			}
		},

	})				
				




	document.addEventListener('keydown', (ev)=>{
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			if (ev.code=='KeyS' && ev.ctrlKey==true) {
				if (!form.isInViewMode()) {
					form.btn_save_click();
				}
				ev.stopPropagation()
				ev.preventDefault()
			}
		}
	}, true)
	
	document.addEventListener('OnSizeRecalculated', (ev) => {
		OnSizeRecalculated(ev.detail.width, ev.detail.height)
	})	

	document.addEventListener('OnButtonBack', (ev) => {
		var element = document.activeElement;
		element.blur();
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			ev.detail.cancel = true;
			if (form.isDataChanged()) {
				form.canceledit(()=>{
					$ui.getPages().show('pnl_list', ()=>{
						form.setViewMode()
						$ui.getPages().ITEMS['pnl_list'].handler.scrolllast()
					})
				})
			} else {
				$ui.getPages().show('pnl_list', ()=>{
					form.setViewMode()
					$ui.getPages().ITEMS['pnl_list'].handler.scrolllast()
				})
			}
		
		}
	})

	document.addEventListener('OnButtonHome', (ev) => {
		if ($ui.getPages().getCurrentPage()==this_page_id) {
			if (form.isDataChanged()) {
				ev.detail.cancel = true;
				$ui.ShowMessage('Anda masih dalam mode edit dengan pending data, silakan matikan mode edit untuk kembali ke halaman utama.')
			}
		}
	})

	//button state
	if (typeof hnd.init==='function') {
		hnd.init({
			form: form,
			obj: obj,
			opt: opt,
			btn_action_click: (actionargs) => {
				if (typeof btn_action_click == 'function') {
					btn_action_click(actionargs);
				}
			}
		})
	}

}

export function OnSizeRecalculated(width, height) {
}

export function getForm() {
	return form
}

export function getCurrentRowdata() {
	return rowdata;
}

export function open(data, rowid, viewmode=true, fn_callback) {

	var caption = txt_caption.template;
	caption = caption.replace('{{STATE_BEG}}', '');
	caption = caption.replace('{{STATE_END}}', ' View');
	txt_caption.html(caption);


	rowdata = {
		data: data,
		rowid: rowid
	}

	var pOpt = form.getDefaultPrompt(false)
	var fn_dataopening = async (options) => {
		options.criteria[form.primary.mapping] = data[form.primary.mapping]
	}

	var fn_dataopened = async (result, options) => {
		var record = result.record;
		updatefilebox(record);

		/*
		if (result.record.crmsource_id==null) { result.record.crmsource_id='--NULL--'; result.record.crmsource_name='NONE'; }

		*/
		for (var objid in obj) {
			let o = obj[objid]
			if (o.isCombo() && !o.isRequired()) {
				var value =  result.record[o.getFieldValueName()];
				if (value==null ) {
					record[o.getFieldValueName()] = pOpt.value;
					record[o.getFieldDisplayName()] = pOpt.text;
				}
			}
		}
  		updaterecordstatus(record)

		/* handle data saat opening data */   
		if (typeof hnd.form_dataopening == 'function') {
			hnd.form_dataopening(result, options);
		}


		form.SuspendEvent(true);
		form
			.fill(record)
			.setValue(obj.cbo_crmsource_id, record.crmsource_id, record.crmsource_name)
			.setViewMode(viewmode)
			.lock(false)
			.rowid = rowid


		/* tambahkan event atau behaviour saat form dibuka
		   apabila ada rutin mengubah form dan tidak mau dijalankan pada saat opening,
		   cek dengan form.isEventSuspended()
		*/   
		if (typeof hnd.form_dataopened == 'function') {
			hnd.form_dataopened(result, options);
		}


		/* commit form */
		form.commit()
		form.SuspendEvent(false); 
		updatebuttonstate(record)


		/* update rowdata */
		for (var nv in rowdata.data) {
			if (record[nv]!=undefined) {
				rowdata.data[nv] = record[nv];
			}
		}

		// tampilkan form untuk data editor
		if (typeof fn_callback==='function') {
			fn_callback(null, rowdata.data);
		}
		
	}

	var fn_dataopenerror = (err) => {
		$ui.ShowMessage('[ERROR]'+err.errormessage);
	}

	form.dataload(fn_dataopening, fn_dataopened, fn_dataopenerror)
	
}


export function createnew() {

	var caption = txt_caption.template;
	caption = caption.replace('{{STATE_BEG}}', 'Create New ');
	caption = caption.replace('{{STATE_END}}', '');
	txt_caption.html(caption);


	form.createnew(async (data, options)=>{
		// console.log(data)
		// console.log(options)
		form.rowid = null

		// set nilai-nilai default untuk form
		data.crmevent_dtstart = global.now()
		data.crmevent_dtend = global.now()
		data.crmevent_dtaffected = global.now()
		data.crmevent_iscommit = '0'
		data.crmevent_isdisabled = '0'
		data.crmevent_isunlimit = '0'
		data.crmevent_isclose = '0'
		data.crmevent_targetinvited = 0
		data.crmevent_targetattendant = 0
		data.crmevent_targetnewcontact = 0
		data.crmevent_targettx = 0
		data.crmevent_targettxnew = 0
		data.crmevent_targetbuyer = 0
		data.crmevent_targetbuyernew = 0
		data.crmevent_targetsales = 0
		data.crmevent_targetsalesnew = 0
		data.crmevent_totalinvited = 0
		data.crmevent_totalattendant = 0
		data.crmevent_totalnewcontact = 0
		data.crmevent_totaltx = 0
		data.crmevent_totaltxnew = 0
		data.crmevent_totalbuyer = 0
		data.crmevent_totalbuyernew = 0
		data.crmevent_totalsales = 0
		data.crmevent_totalsalesnew = 0

		data.crmsource_id = '--NULL--'
		data.crmsource_name = 'NONE'

		if (typeof hnd.form_newdata == 'function') {
			// untuk mengambil nilai ui component,
			// di dalam handler form_newdata, gunakan perintah:
			// options.OnNewData = () => {
			// 		...
			// }		
			hnd.form_newdata(data, options);
		}




		options.OnCanceled = () => {
			$ui.getPages().show('pnl_list')
		}

		$ui.getPages().ITEMS['pnl_editinvitedgrid'].handler.createnew(data, options)
		$ui.getPages().ITEMS['pnl_editattendantgrid'].handler.createnew(data, options)


	})
}


export function getHeaderData() {
	var header_data = form.getData();
	if (typeof hnd.form_getHeaderData == 'function') {
		hnd.form_getHeaderData(header_data);
	}
	return header_data;
}

export function detil_open(pnlname) {
	if (form.isDataChanged()) {
		$ui.ShowMessage('Simpan dulu perubahan datanya.')
		return;
	}

	//$ui.getPages().show(pnlname)
	let header_data = getHeaderData();
	if (typeof hnd.form_detil_opening == 'function') {
		hnd.form_detil_opening(pnlname, (cancel)=>{
			if (cancel===true) {
				return;
			}
			$ui.getPages().show(pnlname, () => {
				$ui.getPages().ITEMS[pnlname].handler.OpenDetil(header_data)
			})
		});
	} else {
		$ui.getPages().show(pnlname, () => {
			$ui.getPages().ITEMS[pnlname].handler.OpenDetil(header_data)
		})
	}

	
}


function updatefilebox(record) {
	// apabila ada keperluan untuk menampilkan data dari object storage


	if (typeof hnd.form_updatefilebox == 'function') {
		hnd.form_updatefilebox(record);
	}
}

function updaterecordstatus(record) {
	// apabila ada keperluan untuk update status record di sini


	if (typeof hnd.form_updaterecordstatus == 'function') {
		hnd.form_updaterecordstatus(record);
	}
}

function updatebuttonstate(record) {
	// apabila ada keperluan untuk update state action button di sini


	if (typeof hnd.form_updatebuttonstate == 'function') {
		hnd.form_updatebuttonstate(record);
	}
}

function updategridstate(record) {
	var updategriddata = {}

	// apabila ada keperluan untuk update state grid list di sini


	if (typeof hnd.form_updategridstate == 'function') {
		hnd.form_updategridstate(updategriddata, record);
	}

	$ui.getPages().ITEMS['pnl_list'].handler.updategrid(updategriddata, form.rowid);

}

function form_viewmodechanged(viewmode) {

	var caption = txt_caption.template;
	if (viewmode) {
		caption = caption.replace('{{STATE_BEG}}', '');
		caption = caption.replace('{{STATE_END}}', ' View');
	} else {
		caption = caption.replace('{{STATE_BEG}}', '');
		caption = caption.replace('{{STATE_END}}', ' Edit');
	}
	txt_caption.html(caption);


	var OnViewModeChangedEvent = new CustomEvent('OnViewModeChanged', {detail: {}})
	$ui.triggerevent(OnViewModeChangedEvent, {
		viewmode: viewmode
	})
}

function form_idsetup(options) {
	var objid = obj.txt_crmevent_id
	switch (options.action) {
		case 'fill' :
			objid.textbox('disable') 
			break;

		case 'createnew' :
			// console.log('new')
			if (form.autoid) {
				objid.textbox('disable') 
				objid.textbox('setText', '[AUTO]') 
			} else {
				objid.textbox('enable') 
			}
			break;
			
		case 'save' :
			objid.textbox('disable') 
			break;	
	}
}


async function form_datasaving(data, options) {
	// cek dulu data yang akan disimpan,
	// apabila belum sesuai dengan yang diharuskan, batalkan penyimpanan
	//    options.cancel = true

	// Modifikasi object data, apabila ingin menambahkan variabel yang akan dikirim ke server
	// options.skipmappingresponse = ['crmsource_id', ];
	options.skipmappingresponse = [];
	for (var objid in obj) {
		var o = obj[objid]
		if (o.isCombo() && !o.isRequired()) {
			var id = o.getFieldValueName()
			options.skipmappingresponse.push(id)
			// console.log(id)
		}
	}

	if (typeof hnd.form_datasaving == 'function') {
		hnd.form_datasaving(data, options);
	}

}

async function form_datasaveerror(err, options) {
	// apabila mau olah error messagenya
	// $ui.ShowMessage(err.errormessage)
	console.error(err)
	if (typeof hnd.form_datasaveerror == 'function') {
		hnd.form_datasaveerror(err, options);
	}
	if (options.supress_error_dialog!=true) {
		$ui.ShowMessage('[ERROR]'+err.message);
	}

}


async function form_datasaved(result, options) {
	// Apabila tidak mau munculkan dialog
	// options.suppressdialog = true

	// Apabila ingin mengganti message Data Tersimpan
	// options.savedmessage = 'Data sudah disimpan cuy!'

	// if (form.isNewData()) {
	// 	console.log('masukan ke grid')
	// 	$ui.getPages().ITEMS['pnl_list'].handler.updategrid(form.getData())
	// } else {
	// 	console.log('update grid')
	// }


	var data = {}
	Object.assign(data, form.getData(), result.dataresponse)
	/*
	form.setValue(obj.cbo_crmsource_id, result.dataresponse.crmsource_name!=='--NULL--' ? result.dataresponse.crmsource_id : '--NULL--', result.dataresponse.crmsource_name!=='--NULL--'?result.dataresponse.crmsource_name:'NONE')

	*/

	var pOpt = form.getDefaultPrompt(false)
	for (var objid in obj) {
		var o = obj[objid]
		if (o.isCombo() && !o.isRequired()) {
			var value =  result.dataresponse[o.getFieldValueName()];
			var text = result.dataresponse[o.getFieldDisplayName()];
			if (value==null ) {
				value = pOpt.value;
				text = pOpt.text;
			}
			form.setValue(o, value, text);
		}
	}
	form.rowid = $ui.getPages().ITEMS['pnl_list'].handler.updategrid(data, form.rowid)
	var rowdata = {
		data: data,
		rowid: form.rowid
	}

	if (typeof hnd.form_datasaved == 'function') {
		hnd.form_datasaved(result, rowdata, options);
	}
}



async function form_deleting(data, options) {
	if (typeof hnd.form_deleting == 'function') {
		hnd.form_deleting(data, options);
	}
}

async function form_deleted(result, options) {
	$ui.getPages().show('pnl_list')
	$ui.getPages().ITEMS['pnl_list'].handler.removerow(form.rowid)

	if (typeof hnd.form_deleted == 'function') {
		hnd.form_deleted(result, options);
	}
}




