<?php namespace FGTA4\apis;

if (!defined('FGTA4')) {
	die('Forbiden');
}

require_once __ROOT_DIR.'/core/sqlutil.php';
// require_once __ROOT_DIR . "/core/sequencer.php";
require_once __DIR__ . '/xapi.base.php';

if (is_file(__DIR__ .'/data-header-handler.php')) {
	require_once __DIR__ .'/data-header-handler.php';
}


use \FGTA4\exceptions\WebException;
// use \FGTA4\utils\Sequencer;



/**
 * crm/engage/crmevent/apis/save.php
 *
 * ====
 * Save
 * ====
 * Menampilkan satu baris data/record sesuai PrimaryKey,
 * dari tabel header crmevent (trn_crmevent)
 *
 * Agung Nugroho <agung@fgta.net> http://www.fgta.net
 * Tangerang, 26 Maret 2021
 *
 * digenerate dengan FGTA4 generator
 * tanggal 24/11/2023
 */
$API = new class extends crmeventBase {
	
	public function execute($data, $options) {
		$event = 'on-save';
		$tablename = 'trn_crmevent';
		$primarykey = 'crmevent_id';
		$autoid = $options->autoid;
		$datastate = $data->_state;
		$userdata = $this->auth->session_get_user();

		$handlerclassname = "\\FGTA4\\apis\\crmevent_headerHandler";
		$hnd = null;
		if (class_exists($handlerclassname)) {
			$hnd = new crmevent_headerHandler($options);
			$hnd->caller = &$this;
			$hnd->db = &$this->db;
			$hnd->auth = $this->auth;
			$hnd->reqinfo = $this->reqinfo;
			$hnd->event = $event;
		} else {
			$hnd = new \stdClass;
		}

		try {

			// cek apakah user boleh mengeksekusi API ini
			if (!$this->RequestIsAllowedFor($this->reqinfo, "save", $userdata->groups)) {
				throw new \Exception('your group authority is not allowed to do this action.');
			}

			if (method_exists(get_class($hnd), 'init')) {
				// init(object &$options) : void
				$hnd->init($options);
			}

			$result = new \stdClass; 
			
			$key = new \stdClass;
			$obj = new \stdClass;
			foreach ($data as $fieldname => $value) {
				if ($fieldname=='_state') { continue; }
				if ($fieldname==$primarykey) {
					$key->{$fieldname} = $value;
				}
				$obj->{$fieldname} = $value;
			}

			// apabila ada tanggal, ubah ke format sql sbb:
			// $obj->tanggal = (\DateTime::createFromFormat('d/m/Y',$obj->tanggal))->format('Y-m-d');
			$obj->crmevent_dtactive = (\DateTime::createFromFormat('d/m/Y',$obj->crmevent_dtactive))->format('Y-m-d');
			$obj->crmevent_dtstart = (\DateTime::createFromFormat('d/m/Y',$obj->crmevent_dtstart))->format('Y-m-d');
			$obj->crmevent_dtend = (\DateTime::createFromFormat('d/m/Y',$obj->crmevent_dtend))->format('Y-m-d');
			$obj->crmevent_dtaffected = (\DateTime::createFromFormat('d/m/Y',$obj->crmevent_dtaffected))->format('Y-m-d');

			$obj->crmevent_name = strtoupper($obj->crmevent_name);


			if ($obj->crmevent_descr=='') { $obj->crmevent_descr = '--NULL--'; }
			if ($obj->crmevent_message=='') { $obj->crmevent_message = '--NULL--'; }
			if ($obj->crmevent_invitationmessage=='') { $obj->crmevent_invitationmessage = '--NULL--'; }
			if ($obj->crmevent_registeredmessage=='') { $obj->crmevent_registeredmessage = '--NULL--'; }
			if ($obj->crmevent_targetinvited=='') { $obj->crmevent_targetinvited = '--NULL--'; }
			if ($obj->crmevent_targetattendant=='') { $obj->crmevent_targetattendant = '--NULL--'; }




			// current user & timestamp	
			if ($datastate=='NEW') {
				$obj->_createby = $userdata->username;
				$obj->_createdate = date("Y-m-d H:i:s");

				if (method_exists(get_class($hnd), 'PreCheckInsert')) {
					// PreCheckInsert($data, &$obj, &$options)
					$hnd->PreCheckInsert($data, $obj, $options);
				}
			} else {
				$obj->_modifyby = $userdata->username;
				$obj->_modifydate = date("Y-m-d H:i:s");	
		
				if (method_exists(get_class($hnd), 'PreCheckUpdate')) {
					// PreCheckUpdate($data, &$obj, &$key, &$options)
					$hnd->PreCheckUpdate($data, $obj, $key, $options);
				}
			}

			//handle data sebelum sebelum save
			if (method_exists(get_class($hnd), 'DataSaving')) {
				// ** DataSaving(object &$obj, object &$key)
				$hnd->DataSaving($obj, $key);
			}

			$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,0);
			$this->db->beginTransaction();

			try {

				$action = '';
				if ($datastate=='NEW') {
					$action = 'NEW';
					if ($autoid) {
						$obj->{$primarykey} = $this->NewId($hnd, $obj);
					}
					
					// handle data sebelum pada saat pembuatan SQL Insert
					if (method_exists(get_class($hnd), 'RowInserting')) {
						// ** RowInserting(object &$obj)
						$hnd->RowInserting($obj);
					}
					$cmd = \FGTA4\utils\SqlUtility::CreateSQLInsert($tablename, $obj);
				} else {
					$action = 'MODIFY';

					// handle data sebelum pada saat pembuatan SQL Update
					if (method_exists(get_class($hnd), 'RowUpdating')) {
						// ** RowUpdating(object &$obj, object &$key))
						$hnd->RowUpdating($obj, $key);
					}
					$cmd = \FGTA4\utils\SqlUtility::CreateSQLUpdate($tablename, $obj, $key);
				}
	
				$stmt = $this->db->prepare($cmd->sql);
				$stmt->execute($cmd->params);

				\FGTA4\utils\SqlUtility::WriteLog($this->db, $this->reqinfo->modulefullname, $tablename, $obj->{$primarykey}, $action, $userdata->username, (object)[]);




				// result
				$options->criteria = [
					"crmevent_id" => $obj->crmevent_id
				];

				$criteriaValues = [
					"crmevent_id" => " crmevent_id = :crmevent_id "
				];
				if (method_exists(get_class($hnd), 'buildOpenCriteriaValues')) {
					// buildOpenCriteriaValues(object $options, array &$criteriaValues) : void
					$hnd->buildOpenCriteriaValues($options, $criteriaValues);
				}

				$where = \FGTA4\utils\SqlUtility::BuildCriteria($options->criteria, $criteriaValues);
				$result = new \stdClass; 
	
				if (method_exists(get_class($hnd), 'prepareOpenData')) {
					// prepareOpenData(object $options, $criteriaValues) : void
					$hnd->prepareOpenData($options, $criteriaValues);
				}

				$sqlFieldList = [
					'crmevent_id' => 'A.`crmevent_id`', 'crmevent_name' => 'A.`crmevent_name`', 'crmevent_descr' => 'A.`crmevent_descr`', 'crmevent_dtactive' => 'A.`crmevent_dtactive`',
					'crmevent_dtstart' => 'A.`crmevent_dtstart`', 'crmevent_dtend' => 'A.`crmevent_dtend`', 'crmevent_dtaffected' => 'A.`crmevent_dtaffected`', 'crmevent_message' => 'A.`crmevent_message`',
					'crmevent_invitationmessage' => 'A.`crmevent_invitationmessage`', 'crmevent_registeredmessage' => 'A.`crmevent_registeredmessage`', 'crmevent_iscommit' => 'A.`crmevent_iscommit`', 'crmevent_isdisabled' => 'A.`crmevent_isdisabled`',
					'crmevent_isunlimit' => 'A.`crmevent_isunlimit`', 'crmevent_isclose' => 'A.`crmevent_isclose`', 'crmevent_targetinvited' => 'A.`crmevent_targetinvited`', 'crmevent_targetattendant' => 'A.`crmevent_targetattendant`',
					'crmevent_targetnewcontact' => 'A.`crmevent_targetnewcontact`', 'crmevent_targettx' => 'A.`crmevent_targettx`', 'crmevent_targettxnew' => 'A.`crmevent_targettxnew`', 'crmevent_targetbuyer' => 'A.`crmevent_targetbuyer`',
					'crmevent_targetbuyernew' => 'A.`crmevent_targetbuyernew`', 'crmevent_targetsales' => 'A.`crmevent_targetsales`', 'crmevent_targetsalesnew' => 'A.`crmevent_targetsalesnew`', 'crmevent_totalinvited' => 'A.`crmevent_totalinvited`',
					'crmevent_totalattendant' => 'A.`crmevent_totalattendant`', 'crmevent_totalnewcontact' => 'A.`crmevent_totalnewcontact`', 'crmevent_totaltx' => 'A.`crmevent_totaltx`', 'crmevent_totaltxnew' => 'A.`crmevent_totaltxnew`',
					'crmevent_totalbuyer' => 'A.`crmevent_totalbuyer`', 'crmevent_totalbuyernew' => 'A.`crmevent_totalbuyernew`', 'crmevent_totalsales' => 'A.`crmevent_totalsales`', 'crmevent_totalsalesnew' => 'A.`crmevent_totalsalesnew`',
					'_createby' => 'A.`_createby`', '_createdate' => 'A.`_createdate`', '_modifyby' => 'A.`_modifyby`', '_modifydate' => 'A.`_modifydate`'
				];
				$sqlFromTable = "trn_crmevent A";
				$sqlWhere = $where->sql;
					
				if (method_exists(get_class($hnd), 'SqlQueryOpenBuilder')) {
					// SqlQueryOpenBuilder(array &$sqlFieldList, string &$sqlFromTable, string &$sqlWhere, array &$params) : void
					$hnd->SqlQueryOpenBuilder($sqlFieldList, $sqlFromTable, $sqlWhere, $where->params);
				}
				$sqlFields = \FGTA4\utils\SqlUtility::generateSqlSelectFieldList($sqlFieldList);
	
			
				$sqlData = "
					select 
					$sqlFields 
					from 
					$sqlFromTable 
					$sqlWhere 
				";
	
				$stmt = $this->db->prepare($sqlData);
				$stmt->execute($where->params);
				$row  = $stmt->fetch(\PDO::FETCH_ASSOC);
	
				$record = [];
				foreach ($row as $key => $value) {
					$record[$key] = $value;
				}

				$dataresponse = array_merge($record, [
					//  untuk lookup atau modify response ditaruh disini
					'crmevent_dtactive' => date("d/m/Y", strtotime($row['crmevent_dtactive'])),
					'crmevent_dtstart' => date("d/m/Y", strtotime($row['crmevent_dtstart'])),
					'crmevent_dtend' => date("d/m/Y", strtotime($row['crmevent_dtend'])),
					'crmevent_dtaffected' => date("d/m/Y", strtotime($row['crmevent_dtaffected'])),

					'_createby' => \FGTA4\utils\SqlUtility::Lookup($record['_createby'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),
					'_modifyby' => \FGTA4\utils\SqlUtility::Lookup($record['_modifyby'], $this->db, $GLOBALS['MAIN_USERTABLE'], 'user_id', 'user_fullname'),
				]);
				
				if (method_exists(get_class($hnd), 'DataOpen')) {
					//  DataOpen(array &$record) : void 
					$hnd->DataOpen($dataresponse);
				}

				$result->username = $userdata->username;
				$result->dataresponse = (object) $dataresponse;
				if (method_exists(get_class($hnd), 'DataSavedSuccess')) {
					// DataSavedSuccess(object &$result) : void
					$hnd->DataSavedSuccess($result);
				}

				$this->db->commit();
				return $result;

			} catch (\Exception $ex) {
				$this->db->rollBack();
				throw $ex;
			} finally {
				$this->db->setAttribute(\PDO::ATTR_AUTOCOMMIT,1);
			}

		} catch (\Exception $ex) {
			throw $ex;
		}
	}

	public function NewId(object $hnd, object $obj) : string {
		// dipanggil hanya saat $autoid == true;

		$id = null;
		$handled = false;
		if (method_exists(get_class($hnd), 'CreateNewId')) {
			// CreateNewId(object $obj) : string 
			$id = $hnd->CreateNewId($obj);
			$handled = true;
		}

		if (!$handled) {
			$id = uniqid();
		}

		return $id;
	}

};