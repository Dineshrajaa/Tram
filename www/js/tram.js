$(document).ready(function(){
	var dbName;//Database Name

		/**Start of DB Methods**/
	//Method to Initialize Tables
	function dbSetting(){
		dbName.transaction(function(tx){
			//tx.executeSql("drop table passengertable");
			tx.executeSql("create table if not exists passengertable(pid integer primary key,pfname text unique,plname text,page integer,ppass text,pphone text,paddress text)");
			//tx.executeSql("drop table tramtable");
			tx.executeSql("create table if not exists tramtable(tid integer primary key,tname text unique,tatime text,tdtime text,tsource text,tdestination text,tfare text,tcapacity integer)");
			//alert("Created Ttable");
		});	tx.executeSql("create table if not exists bookingtable(bid integer primary key,bpid integer,btid integer,bseatcount integer)")
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
		if (alname=="admin" && alpass=="admin") $(":mobile-pagecontainer").pagecontainer("change","#ad-page");
		else alert("Sorry you are not admin");
	}

	//Method to add Tram
	function addTram(){
		var stname=$("#tramname").val();
		var statime=$("#tramarrivaltime").val();
		var stdtime=$("#tramdeparturetime").val();
		var stsource=$("#tramsource").val();
		var stdestination=$("#tramdestination").val();
		var stfare=$("#tramfare").val();
		var stcapacity=$("#tramcapacity").val();
		dbName.transaction(function(tx){
			tx.executeSql("insert into tramtable(tname,tatime,tdtime,tsource,tdestination,tfare,tcapacity) values(?,?,?,?,?,?,?)",[stname,statime,stdtime,stsource,stdestination,stfare,stcapacity]);
		});
		toastAlert("Saved Tram Details");
		onTramListRequest();
	}

	//Method to list Trams
	function listTram(){
		$("#tramlist").html(" ");
		dbName.transaction(function(tx){
			tx.executeSql("select * from tramtable",[],function(tx,results){
				for(var i=0;i<results.rows.length;i++){
					var row=results.rows.item(i);
					$("#tramlist").append("<li id='"+i+"'><a href='#'><h2>"+row.tname+"</h2><p>Availability:Daily<br/>Arrival:"+row.tatime+" Departure:"+row.tdtime+"<br/>Source:"+row.tsource+" Destination:"+row.tdestination+"</p><p class='ui-li-aside'>Rs."+row.tfare+"</p></li>");
				}
				$("#tramlist").listview("refresh");
			});
		});
	}

	//Reusable Method for Listing Tram Details
	function onTramListRequest(){
		$(":mobile-pagecontainer").pagecontainer("change","#vtd-page");
		listTram();
	}

	//Reusable Method for Populating Source and Destination Dropdown Menu
	function populateMenu(){
		$("#sourcemenu,#destinationmenu,#possibletramlist").html(" ");
		dbName.transaction(function(tx){
			tx.executeSql("select * from tramtable",[],function(tx,results){
				for(var i=0;i<results.rows.length;i++){
					var row=results.rows.item(i);
					$("#sourcemenu").append("<option value='"+i+"'>"+row.tsource+"</option>");
					$("#destinationmenu").append("<option value='"+i+"'>"+row.tdestination+"</option>");
				}
				$("#sourcemenu,#destinationmenu").selectmenu("refresh");
			});
		});
		
	}

	//Reusable Method for listing Available Trams
	function findAvailableTrams(){
		var fsource=$("#sourcemenu :selected").text();
		var fdestination=$("#destinationmenu :selected").text();
		$("#possibletramlist").html(" ");
		dbName.transaction(function(tx){
			tx.executeSql("select * from tramtable where tsource='"+fsource+"' and tdestination='"+fdestination+"'",[],function(tx,results){
				for(var i=0;i<results.rows.length;i++){
					var row=results.rows.item(i);
					$("#possibletramlist").append("<li id='"+row.tid+"'><a href='#'><h2>"+row.tname+"</h2><p>Availability:Daily<br/>Arrival:"+row.tatime+" Departure:"+row.tdtime+"<br/>Source:"+row.tsource+" Destination:"+row.tdestination+"</p><p class='ui-li-aside'>Rs."+row.tfare+"</p></li>");
				}
				$("#possibletramlist").listview("refresh");
			});
		});
	}

	//Method to Book Tickets
	function promptBookingPage(selectedtramid){
		$(":mobile-pagecontainer").pagecontainer("change","#bookingprompt-page");
		dbName.transaction(function(tx){
			tx.executeSql("select * from tramtable where tid='"+selectedtramid+"'",[],function(tx,results){
				var row=results.rows.item(0);
				$("#selectedtramlabel").text(row.tname);

			});
		});
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
		//Shows Admin Login Form
		$(":mobile-pagecontainer").pagecontainer("change","#al-page");
	});

	$("#atdbtn").tap(function(){
		//Shows Add Tram Page
		$(":mobile-pagecontainer").pagecontainer("change","#atd-page");
	});

	$("#bookpgbtn").tap(function(){
		//Shows the Search page which is the key to Book Tickets
		$(":mobile-pagecontainer").pagecontainer("change","#bpd-page");
		populateMenu();
	});

	$(document).on("tap","#possibletramlist li",function(){
		//Shows Booking Page
		promptBookingPage($(this).id);
	});

	$("#regbtn").tap(registerPassenger);//Stores Passenger details in DB

	$("#loginbtn").tap(loginPassenger);//Logs in Passenger if the Login Credentials are Valid

	$("#adminloginbtn").tap(loginAdmin);//Logs in admin after validation

	$("#atbtn").tap(addTram);//Allows admin to add Tram Details

	$("#vtdbtn,#tdbtn").tap(onTramListRequest);//Displays all the available Tram List

	$("#tramsearchbtn").tap(findAvailableTrams);//Allows Registered Passengers to Search Trams
	
	//Loaded all DOM elements
});