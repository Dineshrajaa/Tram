$(document).ready(function(){
	var dbName;//Database Name

		/**Start of DB Methods**/
	//Method to Initialize Tables
	function dbSetting(){
		dbName.transaction(function(tx){
			//tx.executeSql("drop table passengertable");
			tx.executeSql("create table if not exists passengertable(pid integer primary key,pfname text unique,plname text,page integer,ppass text,pphone text,paddress text)");
			//alert("Created Ptable");
			tx.executeSql("create table if not exists tramtable(tid integer primary key,tname text unique,tday text,ttime text,tsource text,tdestination text)");
			//alert("Created Ttable");
		});
	}

	//Method to Register Passengers
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

	//Method to validate and Login Passengers
	function loginPassenger(){
		//alert("Going to Login");
		var lname=$("#uname").val();
		var lpass=$("#upass").val();
		dbName.transaction(function(tx){
			tx.executeSql("select * from passengertable where pfname='"+lname+"' and ppass='"+lpass+"'",[],function(transaction,results){
				
				if(results.rows.length>0) $(":mobile-pagecontainer").pagecontainer("change","#pd-page");
				else alert("Check your Login Credentials");
			});
		});
	}

	//Method to validate and Loging Admin
	function loginAdmin(){		
		var alname=$("#aname").val();
		var alpass=$("#apass").val();
		if (alname=="admin" && alpass=="admin") alert("Welcome Admin");
		else alert("Sorry you are not admin");
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

	$("#loginbtn").tap(loginPassenger);

	$("#adminloginbtn").tap(loginAdmin);
	//Loaded all DOM elements
});