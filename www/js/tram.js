$(document).ready(function(){
	var dbName;//Database Name

		/**Start of DB Methods**/
	function dbSetting(){
		dbName.transaction(function(tx){
			tx.executeSql("create table if not exists passengertable(pid integer primary key,pfname text,plname text,page integer,ppass text,pphone text,paddress text)");
			//alert("Created Ptable");
			tx.executeSql("create table if not exists tramtable(tid integer primary key,tname text,tday text,ttime text,tsource text,tdestination text)");
			//alert("Created Ttable");
		});
	}

	function registerPassenger(){
		var sfname=$("#fname").val();
		var slname=$("#lname").val();
		var sage=$("#age").val();
		var spass=$("#pass").val();
		var smobile=$("#mobile").val();
		var saddress=$("#address").val();
		dbName.transaction(function(tx){
			tx.executeSql("insert into passengertable(pfname,plname,page,ppass,pphone,paddress) values(?,?,?,?,?,?)",[sfname,slname,sage,spass,smobile,saddress]);
		});
		toastAlert("Successfully Saved Profile");
	}

		/**End of DB Methods**/

	//Method to display Toast Alerts
	function toastAlert(msg){
		window.plugins.toast.showLongBottom(msg);
	}



	document.addEventListener('deviceready',function(){
		dbName=window.sqlitePlugin.openDatabase({name: "tram.db"});

		//Create necessary Tables
	dbSetting();
		//Device Ready
	});

	$("#prbtn").tap(function(){
		//Shows Passenger Registration Form
		$(":mobile-pagecontainer").pagecontainer("change","#pr-page");
	});

	$("#plbtn").tap(function(){
		//Shows Passenger Login Form
		$(":mobile-pagecontainer").pagecontainer("change","#pl-page");
	});

	$("#albtn").tap(function(){
		//Shows Passenger Login Form
		$(":mobile-pagecontainer").pagecontainer("change","#al-page");
	});

	$("#regbtn").tap(registerPassenger);
	//Loaded all DOM elements
});