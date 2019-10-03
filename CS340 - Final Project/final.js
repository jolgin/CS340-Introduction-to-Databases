var express = require('express');
var mysql = require('./dbcon.js');


var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3113);

app.get('/',function(req,res,next){
  var context = [];
  mysql.pool.query('SELECT * FROM conference', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    
    context.confRowData = rows;
  });
    
  mysql.pool.query('SELECT * FROM division', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    
    context.divRowData = rows;
  });
    
  mysql.pool.query('SELECT * FROM team', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    
    context.teamRowData = rows;
  });
    
  mysql.pool.query('SELECT * FROM player', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    
    context.playerRowData = rows;
  });
    
  mysql.pool.query('SELECT * FROM specialty', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    
    context.specialtyRowData = rows;
  });
    
    
  mysql.pool.query('SELECT first_name, last_name, type, player_id, specialty_ID, has_spec_ID FROM player JOIN has_specialty ON play_ID = player_id JOIN specialty ON spec_ID = specialty_ID ORDER BY player_id ASC;', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    
    context.playerSpecialtyRowData = rows;
    res.render('home', context);
  });
    
});


app.get('/insert',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO conference SET ?",
	{conference_name: req.query.conference_name},
    function(err, result){
        if(err){
            next(err);
            return;
        }
	mysql.pool.query('SELECT * FROM conference WHERE ?', {conference_name: req.query.conference_name}, function(err, rows, fields){
      	if(err){
        	next(err);
        	return;
      	}
        context.confRowData = JSON.stringify(rows);
        res.type("text/plain");
        res.send(context.confRowData);
   	});
  });
});


app.get('/insertDiv',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO division SET ?",
	{division_name: req.query.division_name, conf_ID: req.query.conf_ID},
    function(err, result){
        if(err){
            next(err);
            return;
        }
	mysql.pool.query('SELECT * FROM division WHERE ?', {division_name: req.query.division_name}, function(err, rows, fields){
      	if(err){
        	next(err);
        	return;
      	}
        context.divRowData = JSON.stringify(rows);
        res.type("text/plain");
        res.send(context.divRowData);
   	});
  });
});


app.get('/insertTeam',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO team SET ?",
	{team_name: req.query.team_name, coach_name: req.query.coach_name, city_name: req.query.city_name, div_ID: req.query.div_ID},
    function(err, result){
        if(err){
            next(err);
            return;
        }
	mysql.pool.query('SELECT * FROM team WHERE ?', {team_name:req.query.team_name}, function(err, rows, fields){
      	if(err){
        	next(err);
        	return;
      	}
        context.teamRowData = JSON.stringify(rows);
        res.type("text/plain");
        res.send(context.teamRowData);
   	});
  });
});


app.get('/insertPlayer',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO player SET ?",
	{first_name: req.query.first_name, last_name: req.query.last_name, number: req.query.number, height_inches: req.query.height_inches, position: req.query.position, t_ID: req.query.t_ID},
    function(err, result){
        if(err){
            next(err);
            return;
        }
	mysql.pool.query('SELECT * FROM player WHERE ?',{first_name:req.query.first_name}, function(err, rows, fields){
      	if(err){
        	next(err);
        	return;
      	}
        context.playerRowData = JSON.stringify(rows);
        res.type("text/plain");
        res.send(context.playerRowData);
   	});
  });
});


app.get('/insertSpecialty',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO specialty SET ?",
	{type: req.query.type},
    function(err, result){
        if(err){
            next(err);
            return;
        }
	mysql.pool.query('SELECT * FROM specialty WHERE ?', {type:req.query.type}, function(err, rows, fields){
      	if(err){
        	next(err);
        	return;
      	}
        context.specialtyRowData = JSON.stringify(rows);
        res.type("text/plain");
        res.send(context.specialtyRowData);
   	});
  });
});



app.get('/insertPlayerSpecialty',function(req,res,next){
  var context = {};
  mysql.pool.query("INSERT INTO has_specialty SET ?",
	{play_ID: req.query.play_ID, spec_ID: req.query.spec_ID},
    function(err, result){
        if(err){
            next(err);
            return;
        }
	mysql.pool.query('SELECT * FROM has_specialty', function(err, rows, fields){
      	if(err){
        	next(err);
        	return;
      	}
        context.playerSpecialtyRowData = JSON.stringify(rows);
        res.type("text/plain");
        res.send(context.playerSpecialtyRowData);
   	});
  });
});



app.get('/delete',function(req,res,next){
  mysql.pool.query("DELETE FROM division WHERE division_id=?", [req.query.division_ID], function(err, result){
    if(err){
      next(err);
      return;
    }
    res.send(null);
  });
});



app.get('/deletePlaySpec',function(req,res,next){
  mysql.pool.query("DELETE FROM has_specialty WHERE has_spec_ID=?", [req.query.has_spec_ID], function(err, result){
    if(err){
      next(err);
      return;
    }
    res.send(null);
  });
});



app.get('/conferenceChange',function(req,res,next){
    
    if (req.query.conf_ID == ""){
        req.query.conf_ID = null;
        console.log("null")
    }
    else{
        console.log("not null")
    }
    mysql.pool.query("UPDATE division SET conf_ID=? WHERE division_id=?", [req.query.conf_ID, req.query.division_ID], function(err, result){
        if(err){
            next(err);
            return;
        }
        res.send(null);
    })
});



app.get('/divisionChange',function(req,res,next){
     if (req.query.div_ID == ""){
        req.query.div_ID = null;
        console.log("null")
    }
    else{
        console.log("not null")
    }
    
    mysql.pool.query("UPDATE team SET div_ID=? WHERE team_id=?", [req.query.div_ID, req.query.team_ID], function(err, result){
        if(err){
            next(err);
            return;
        }
        res.send(null);
    })
});



app.get('/teamChange',function(req,res,next){
    if (req.query.t_ID == ""){
        req.query.t_ID = null;
        console.log("null")
    }
    else{
        console.log("not null")
    }
    
    
    mysql.pool.query("UPDATE player SET t_ID=? WHERE player_id=?", [req.query.t_ID, req.query.player_id], function(err, result){
        if(err){
            next(err);
            return;
        }
        res.send(null);
    })
});



app.get('/searchTeam',function(req,res,next){
    var context = {};
    mysql.pool.query("SELECT team_name FROM team WHERE team_name=? AND div_ID =?", [req.query.team_name, req.query.div_ID], function(err, result){
        if(err){
            next(err);
            return;
        }
        mysql.pool.query('SELECT * FROM team WHERE ?',{team_name:req.query.team_name}, function(err, rows, fields){
            if(err){
        	   next(err);
        	   return;
      	     }
        context.teamSearchRowData = JSON.stringify(rows);
        res.type("text/plain");
        res.send(context.teamSearchRowData);
        });
    });
});


app.get('/searchPlayer',function(req,res,next){
    mysql.pool.query("SELECT first_name, last_name, position FROM player WHERE first_name=? AND last_name =? AND t_ID=?", [req.query.first_name, req.query.last_name, req.query.t_ID], function(err, result){
        if(err){
            next(err);
            return;
        }
    });   
});



app.get('/specialtyChange',function(req,res,next){
    mysql.pool.query("UPDATE has_specialty SET spec_ID=? WHERE has_spec_ID=?", [req.query.spec_ID, req.query.has_spec_ID], function(err, result){
        if(err){
            next(err);
            return;
        }
        res.send(null);
    })
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip1.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});