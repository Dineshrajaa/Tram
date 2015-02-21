$(document).ready(function(){
	var dbName;//Database Name
	var loggedId,neededTramId,selectedBookingId;

		/**Start of DB Methods**/
	//Method to Initialize Tables
	function dbSetting(){
		dbName.transaction(function(tx){
			//tx.executeSql("drop table passengertable");
			tx.executeSql("create table if not exists passengertable(pid integer primary key,pfname text unique,plname text,page integer,ppass text,pphone text,paddress text)");
			//tx.executeSql("drop table tramtable");
			tx.executeSql("create table if not exists tramtable(tid integer primary key,tname text unique,tatime text,tdtime text,tsource text,tdestination text,tfare text,tcapacity integer,tavailable integer)");
			//alert("Created Ttable");
			tx.executeSql("create table if not exists bookingtable(bid integer primary key,pid integer,tid integer,bseatcount integer,bseatclass text,isapproved integer)");
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
		var lname=$("#uname").val();
		var lpass=$("#upass").val();
		dbName.transaction(function(tx){
			tx.executeSql("select * from passengertable where pfname='"+lname+"' and ppass='"+lpass+"'",[],function(transaction,results){
				loggedId=results.rows.item(0).pid;				
				if(results.rows.length>0) {
					$(":mobile-pagecontainer").pagecontainer("change","#pd-page");
					
				}
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
		var stavailable=stcapacity;
		dbName.transaction(function(tx){
			tx.executeSql("insert into tramtable(tname,tatime,tdtime,tsource,tdestination,tfare,tcapacity,tavailable) values(?,?,?,?,?,?,?,?)",[stname,statime,stdtime,stsource,stdestination,stfare,stcapacity,stavailable]);
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

	//Method to Populate Source and Destination for Guests
	function populateMenuForGuests(){
		$("#startingpoint,#endingpoint,#npossibletramlist").html(" ");
		dbName.transaction(function(tx){
			tx.executeSql("select * from tramtable",[],function(tx,results){
				for(var i=0;i<results.rows.length;i++){
					var row=results.rows.item(i);
					$("#startingpoint").append("<option value='"+i+"'>"+row.tsource+"</option>");
					$("#endingpoint").append("<option value='"+i+"'>"+row.tdestination+"</option>");
				}
				$("#startingpoint,#endingpoint").selectmenu("refresh");
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

	//Method to Populate and show Booking Prompt
	function promptBookingPage(selectedtramid){
		neededTramId=selectedtramid;
		$(":mobile-pagecontainer").pagecontainer("change","#bookingprompt-page");
		dbName.transaction(function(tx){
			tx.executeSql("select * from tramtable where tid='"+selectedtramid+"'",[],function(tx,results){
				var row=results.rows.item(0);
				$("#selectedtramlabel").text(row.tname);
				$("#availablecount").val(row.tavailable);
				$("#selectedtraminfo").html("<p>Tram Summary:<br/>Arrival Time"+row.tatime+" Departure Time:"+row.tdtime+"<br/>Source:"+row.tsource+" Destination:"+row.tdestination+"<br/>Fare:"+row.tfare+"</p>");				
			});
		});
	}

	//Method to Book Tickets
	function bookTickets(){
		var requiredSeat=$("#seatneeded").val();
		var requiredClass=$("#tramclass :selected").text();
		var onhold=0;
		if(requiredSeat<$("#availablecount").val()){
		dbName.transaction(function(tx){
			tx.executeSql("insert into bookingtable(pid,tid,bseatcount,bseatclass,isapproved) values(?,?,?,?,?)",[loggedId,neededTramId,requiredSeat,requiredClass,onhold]);
		});
		toastAlert("Ticked Saved for Confirmation");
		}
		else alert("There is no enough Tickets available");
	}

	//Method to track Ticket
	function trackTickets(){
		dbName.transaction(function(tx){
			tx.executeSql("select * from bookingtable as B join tramtable as T on B.tid=T.tid join passengertable as P on B.pid=P.pid where B.pid='"+loggedId+"'",[],function(tx,results){
				var row=results.rows.item(0);
				$("#ptbid").text(row.bid);
				$("#pttname").text(row.tname);
				//$("#ptdescription").html("<p>Arrival Time: "+row.tatime+" Departure Time: "+row.tdtime+"<br/>Ticket Count: "+row.seatneeded+)
				$("#ptdescription").html("<p>Tram Summary:<br/>Arrival Time"+row.tatime+" Departure Time:"+row.tdtime+"<br/>Source:"+row.tsource+" Destination:"+row.tdestination+"<br/>Total Fare:"+row.tfare*row.bseatcount+"</p>");

				if(row.isapproved==0) $("#ptstatus").text("Ticket Status:Pending for Approval");
				else if(row.isapproved==1) $("#ptstatus").text("Ticket Status:Approved");
				else $("#ptstatus").text("Ticket Status:Rejected");
			});
		});
	}

	//Method to List Pending Tickets
	function listPendingTickets(){
		//alert("Going to List Pending Tickets");
		$(":mobile-pagecontainer").pagecontainer("change","#pendingticket-page");
		$("#pendingticketlist").html(" ");
		dbName.transaction(function(tx){
			tx.executeSql("select * from bookingtable as B join tramtable as T on B.tid=T.tid join passengertable as P on B.pid=P.pid where B.isapproved='0'",[],function(tx,results){
				//and B.tid=T.tid and where B.isapproved='0' as B join passengertable as P on B.pid=P.pid
				for(var i=0;i<results.rows.length;i++){
					var row=results.rows.item(i);
					$("#pendingticketlist").append("<li id='"+row.bid+"'><a href='#'><h2>"+row.pfname+"</h2><p><strong>"+row.tname+"</strong></p><p>Arrival Time:"+row.tatime+" Departure Time:"+row.tdtime+"<br/>Source:"+row.tsource+" Destination:"+row.tdestination+"<br/>Total Fare:"+row.tfare*row.bseatcount+"</p></li>");
				}
				$("#pendingticketlist").listview("refresh");
			});
		});
	}

	//Method to Prompt Approval page
	function promptApprovalPage(pendingticketid){
		selectedBookingId=pendingticketid;
		$(":mobile-pagecontainer").pagecontainer("change","#pendingticketapproval-page");
		dbName.transaction(function(tx){
			tx.executeSql("select * from bookingtable as B join tramtable as T on B.tid=T.tid join passengertable as P on B.pid=P.pid where B.bid='"+pendingticketid+"'",[],function(tx,results){
				var row=results.rows.item(0);
				$("#pbookingid").text("Booking ID: "+row.bid);
				$("#ppassengername").text("Passenger Name: "+row.pfname);
				$("#ptramname").text("Tram Name: "+row.tname);
				$("#pbill").text("Total Bill: "+row.tfare*row.bseatcount);
			});
		});
	}

	//Method to approve Ticket
	function approveTicket(){
		dbName.transaction(function(tx){
			tx.executeSql("update bookingtable set isapproved=1 where bid='"+selectedBookingId+"'");
			tx.executeSql("select * from bookingtable as B join tramtable as T on B.tid=T.tid join passengertable as P on B.pid=P.pid where B.bid='"+selectedBookingId+"'",[],function(tx,results){
				var row=results.rows.item(0);
				var upid=row.pid;
				var utid=row.tid;
				var uavailableseats=row.tavailable-row.bseatcount;
				tx.executeSql("update tramtable set tavailable="+uavailableseats+" where tid='"+utid+"'");
			});
			listPendingTickets();
		});		
	}

	//Method to cancel Ticket
	function cancelTicket(){
		dbName.transaction(function(tx){
			tx.executeSql("update bookingtable set isapproved=2 where bid='"+selectedBookingId+"'");
		});
		listPendingTickets();
	}



	//Method for listing Available Trams for Non-Registered Users
	function nFindAvailableTrams(){
		var fsource=$("#startingpoint :selected").text();
		var fdestination=$("#endingpoint :selected").text();
		$("#npossibletramlist").html(" ");
		dbName.transaction(function(tx){
			tx.executeSql("select * from tramtable where tsource='"+fsource+"' and tdestination='"+fdestination+"'",[],function(tx,results){
				for(var i=0;i<results.rows.length;i++){
					var row=results.rows.item(i);
					$("#npossibletramlist").append("<li id='"+row.tid+"'><a href='#'><h2>"+row.tname+"</h2><p>Availability:Daily<br/>Arrival:"+row.tatime+" Departure:"+row.tdtime+"<br/>Source:"+row.tsource+" Destination:"+row.tdestination+"</p><p class='ui-li-aside'>Rs."+row.tfare+"</p></li>");
				}
				$("#npossibletramlist").listview("refresh");
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

	$("#tsbtn").tap(function(){
		//Shows the Search page to Non-Registered Users
		$(":mobile-pagecontainer").pagecontainer("change","#nrts-page");
		populateMenuForGuests();
	});

	$("#trackpgbtn").tap(function(){
		//Shows the Ticket Tracking Page
		$(":mobile-pagecontainer").pagecontainer("change","#tickettracking-page");
		trackTickets();
	});

	$(document).on("tap","#possibletramlist li",function(){
		//Shows Booking Page
		promptBookingPage($(this).attr('id'));
	});

	$(document).on("tap","#pendingticketlist li",function(){
		//Shows Approval Page
		promptApprovalPage($(this).attr('id'));
	});

	$("#regbtn").tap(registerPassenger);//Stores Passenger details in DB

	$("#loginbtn").tap(loginPassenger);//Logs in Passenger if the Login Credentials are Valid

	$("#adminloginbtn").tap(loginAdmin);//Logs in admin after validation

	$("#atbtn").tap(addTram);//Allows admin to add Tram Details

	$("#vtdbtn,#tdbtn").tap(onTramListRequest);//Displays all the available Tram List

	$("#tramsearchbtn").tap(findAvailableTrams);//Allows Registered Passengers to Search Trams
	
	$("#bookbtn").tap(bookTickets);//Allows User to Book Tickets 

	$("#aptdbtn").tap(listPendingTickets);//Lists the Tickets which are waiting for Admin approval

	$("#approveticketbtn").tap(approveTicket);//Approves the Ticket

	$("#cancelticketbtn").tap(cancelTicket);//Cancel the Ticket

	$("#ntramsearchbtn").tap(nFindAvailableTrams);//Allows Registered Passengers to Search Trams
	

	//Loaded all DOM elements
});