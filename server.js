const express = require("express");
const bodyParser = require("body-parser");
//const https = require("https");
const app = express();

const cors = require('cors');

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors({
    origin: '*'
}));

const oracledb = require('oracledb');

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;


const mypw = "project";

async function verify(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select user_id,password from users where email=:email`,
      {
        "email": req.body.email
      }
    );
    console.log(result.rows);
    if (result.rows.length>0) {
      if (result.rows[0].PASSWORD===req.body.password) {
        let user_id = result.rows[0].USER_ID;
        result = await connection.execute(
          `select max(session_id) session_id from sessions`
        );
        let session_id=(result.rows[0].SESSION_ID==null?1:result.rows[0].SESSION_ID+1);
        result = await connection.execute(
          `INSERT INTO Sessions
          VALUES(:session_id,:userCount)`,
          { "session_id":session_id,
            "userCount":user_id
           }
        );
        await connection.execute(
          `COMMIT`
        );
        result = await connection.execute(
          `select * from subscriptions
           where user_id=:user_id and
           end_date>=SYSDATE`,
          {
            "user_id": user_id
          }
        );
        if (result.rows.length>0) {
          res.send({"status":true,"subscriptionStatus":true, "session_id":session_id});
        }
        else {
          res.send({"status":true,"subscriptionStatus":false, "session_id":session_id});
        }
      }
      else {
        res.send({"status":false,"subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false,"subscriptionStatus":false});
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function adminverify(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from admins where admin_id=:admin_id and password=:password`,
      {
        "admin_id":req.body.admin_id,
        "password":req.body.password
      }
    );
    console.log(result.rows);
    if (result.rows.length>0) {
      res.send({"status":true});
    }
    else {
      res.send({"status":false});
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function dashboardinfo(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from admins where admin_id=:admin_id and password=:password`,
      {
        "admin_id":req.body.admin_id,
        "password":req.body.password
      }
    );
    console.log(result.rows);
    if (result.rows.length>0) {
      result = await connection.execute(
        `select * from countries
         order by name asc`
      );
      let country = result.rows;
      result = await connection.execute(
        `select * from languages
         order by name asc`
      );
      let language = result.rows;
      result = await connection.execute(
        `select * from studios
         order by name asc`
      );
      let studio = result.rows;
      result = await connection.execute(
        `select * from tv_networks
         order by name asc`
      );
      let tvnetwork = result.rows;
      result = await connection.execute(
        `select * from genres
         order by name asc`
      );
      let genre = result.rows;
      result = await connection.execute(
        `select award_id,name from awards
         order by name asc`
      );
      let award = result.rows;
      result = await connection.execute(
        `select actor_id,name from actors
         order by name asc`
      );
      let actor = result.rows;
      result = await connection.execute(
        `select director_id,name from directors
         order by name asc`
      );
      let director = result.rows;
      result = await connection.execute(
        `select content_id,title from contents
         order by title asc`
      );
      let content = result.rows;
      result = await connection.execute(
        `select content_id,title from contents where content_type='T'
         order by title asc`
      );
      let series = result.rows;
      let dailyuser = 0;
      let monthlyuser = 0;
      let dailyrevenue = 0;
      let monthlyrevenue = 0;
      result = await connection.execute(
        `select count(*) num from users
         where joining_date>=trunc(sysdate,'day')`
      );
      dailyuser = result.rows[0].NUM;
      result = await connection.execute(
        `select count(*) num from users
         where joining_date>=trunc(sysdate,'month')`
      );
      monthlyuser = result.rows[0].NUM;
      result = await connection.execute(
        `select sum(amount) num from payments
         where payment_date>=trunc(sysdate,'day')`
      );
      dailyrevenue = result.rows[0].NUM;
      result = await connection.execute(
        `select sum(amount) num from payments
         where payment_date>=trunc(sysdate,'month')`
      );
      monthlyrevenue = result.rows[0].NUM;
      res.send({"status":true,"changeStatus":true,"data":{"stat":{"dailyuser":dailyuser,"monthlyuser":monthlyuser,"dailyrevenue":dailyrevenue,"monthlyrevenue":monthlyrevenue},"country":country,"language":language,"studio":studio,"tvnetwork":tvnetwork,"genre":genre,"award":award,"actor":actor,"director":director,"content":content,"series":series}});
    }
    else {
      res.send({"status":false});
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function addinfo(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from admins where admin_id=:admin_id and password=:password`,
      {
        "admin_id":req.body.admin_id,
        "password":req.body.password
      }
    );
    console.log(result.rows);
    if (result.rows.length>0) {
      if (req.body.space==="country" || req.body.space==="language" || req.body.space==="genre" || req.body.space==="studio" || req.body.space==="tv_network") {
        let table ="";
        if (req.body.space==="country") table="countries";
        else if (req.body.space==="language") table="languages";
        else if (req.body.space==="genre") table="genres";
        else if (req.body.space==="studio") table="studios";
        else if (req.body.space==="tv_network") table="tv_networks";
        let country = req.body.name.toLowerCase();
        result = await connection.execute(
          `select * from `+table+`
           where lower(name)=:country`,
           {
             "country":country
           }
        );
        if (result.rows.length>0) {
          res.send({"status":true,"changeStatus":false});
        }
        else {
          result = await connection.execute(
            `select max(`+req.body.space+`_id) country_id from `+table+``
          );
          let country_id=(result.rows[0].COUNTRY_ID==null?1:result.rows[0].COUNTRY_ID+1);
          result = await connection.execute(
            `insert into `+table+` values(:country_id,INITCAP(:country))`,
             {
               "country":country,
               "country_id":country_id
             }
          );
          result = await connection.execute(
            `commit`
          );
          dashboardinfo(req,res);
        }
      }
      else if (req.body.space==="award") {
        let table ="awards";
        let country = req.body.name.toLowerCase();
        let issuedby = req.body.issuedby.toLowerCase();
        result = await connection.execute(
          `select * from `+table+`
           where lower(name)=:country and lower(issued_by)=:issuedby`,
           {
             "country":country,
             "issuedby":issuedby
           }
        );
        if (result.rows.length>0) {
          res.send({"status":true,"changeStatus":false});
        }
        else {
          result = await connection.execute(
            `select max(`+req.body.space+`_id) country_id from `+table+``
          );
          let country_id=(result.rows[0].COUNTRY_ID==null?1:result.rows[0].COUNTRY_ID+1);
          result = await connection.execute(
            `insert into `+table+` values(:country_id,INITCAP(:country),INITCAP(:issuedby))`,
             {
               "country":country,
               "country_id":country_id,
               "issuedby":issuedby
             }
          );
          result = await connection.execute(
            `commit`
          );
          dashboardinfo(req,res);
        }
      }
      else if (req.body.space==="episodes") {
        let table ="episodes";
        let content = req.body.content;
        let seasonno = req.body.seasonno;
        let episodeno = req.body.episodeno;
        result = await connection.execute(
          `select * from `+table+`
           where content_id=:content and season_no=:seasonno and episode_no=:episodeno`,
           {
             "content":content,
             "seasonno":seasonno,
             "episodeno":episodeno
           }
        );
        if (result.rows.length>0) {
          res.send({"status":true,"changeStatus":false});
        }
        else {
          result = await connection.execute(
            `insert into `+table+` values(:content,:seasonno,:episodeno,:title,TO_DATE(:releasedate,'YYYY-MM-DD'),:description,:duration,:video)`,
             {
               "content":content,
               "seasonno":seasonno,
               "episodeno":episodeno,
               "title":req.body.title,
               "releasedate":req.body.releasedate,
               "description":req.body.description,
               "duration":req.body.duration,
               "video":req.body.video
             }
          );
          result = await connection.execute(
            `commit`
          );
          dashboardinfo(req,res);
        }
      }
      else if (req.body.space==="similar-contents" || req.body.space==="content-genre" || req.body.space==="acted" || req.body.space==="content-received" ||  req.body.space==="actor-received" ||  req.body.space==="director-received") {
        let table ="";
        if (req.body.space==="similar-contents") table="similar_contents";
        else if (req.body.space==="content-genre") table="content_genre";
        else if (req.body.space==="content-received") table="content_received";
        else if (req.body.space==="actor-received") table="actor_received";
        else if (req.body.space==="director-received") table="director_received";
        else if (req.body.space==="acted") table="acted";
        let content1 = 0;
        let content2 = 0;
        let content = 0;
        let genre = 0;
        let actor = 0;
        let award = 0;
        let director = 0;
        if (req.body.space==="similar-contents") {
          content1 = req.body.content1;
          content2 = req.body.content2;
          result = await connection.execute(
            `select * from `+table+`
             where content_id1=:content1 and content_id2=:content2`,
             {
               "content1":content1,
               "content2":content2
             }
          );
        }
        else if (req.body.space==="content-genre") {
          content = req.body.content;
          genre = req.body.genre;
          result = await connection.execute(
            `select * from `+table+`
             where content_id=:content and genre_id=:genre`,
             {
               "content":content,
               "genre":genre
             }
          );
        }
        else if (req.body.space==="acted") {
          content = req.body.content;
          actor = req.body.actor;
          result = await connection.execute(
            `select * from `+table+`
             where content_id=:content and actor_id=:actor`,
             {
               "content":content,
               "actor":actor
             }
          );
        }
        else if (req.body.space==="content-received") {
          content = req.body.content;
          award = req.body.award;
          result = await connection.execute(
            `select * from `+table+`
             where content_id=:content and award_id=:award`,
             {
               "content":content,
               "award":award
             }
          );
        }
        else if (req.body.space==="actor-received") {
          content = req.body.content;
          award = req.body.award;
          actor = req.body.actor;
          result = await connection.execute(
            `select * from acted
             where content_id=:content and actor_id=:actor`,
             {
               "content":content,
               "actor":actor
             }
          );
          if (result.rows.length===0) {
            res.send({"status":true,"errorStatus":true});
            return;
          }
          result = await connection.execute(
            `select * from `+table+`
             where content_id=:content and award_id=:award and actor_id=:actor`,
             {
               "content":content,
               "award":award,
               "actor":actor
             }
          );
        }
        else if (req.body.space==="director-received") {
          content = req.body.content;
          award = req.body.award;
          director = req.body.director;
          result = await connection.execute(
            `select * from contents
             where content_id=:content and director_id=:director`,
             {
               "content":content,
               "director":director
             }
          );
          if (result.rows.length===0) {
            res.send({"status":true,"errorStatus":true});
            return;
          }
          result = await connection.execute(
            `select * from `+table+`
             where content_id=:content and award_id=:award and director_id=:director`,
             {
               "content":content,
               "award":award,
               "director":director
             }
          );
        }
        if (result.rows.length>0) {
          res.send({"status":true,"changeStatus":false});
        }
        else {
          if (req.body.space==="similar-contents") {
            result = await connection.execute(
              `insert into `+table+` values(:content1,:content2)`,
               {
                 "content1":content1,
                 "content2":content2
               }
            );
          }
          else if (req.body.space==="content-genre") {
            result = await connection.execute(
              `insert into `+table+` values(:genre,:content)`,
               {
                 "content":content,
                 "genre":genre
               }
            );
          }
          else if (req.body.space==="acted") {
            result = await connection.execute(
              `insert into `+table+` values(:actor,:content,:charactername)`,
               {
                 "content":content,
                 "actor":actor,
                 "charactername":req.body.charactername
               }
            );
          }
          else if (req.body.space==="content-received") {
            result = await connection.execute(
              `insert into `+table+` values(:content,:award,TO_DATE(:receiveddate,'YYYY-MM-DD'))`,
               {
                 "content":content,
                 "award":award,
                 "receiveddate":req.body.receiveddate
               }
            );
          }
          else if (req.body.space==="actor-received") {
            result = await connection.execute(
              `insert into `+table+` values(:actor,:award,:content,TO_DATE(:receiveddate,'YYYY-MM-DD'))`,
               {
                 "content":content,
                 "award":award,
                 "actor":actor,
                 "receiveddate":req.body.receiveddate
               }
            );
          }
          else if (req.body.space==="director-received") {
            result = await connection.execute(
              `insert into `+table+` values(:director,:award,:content,TO_DATE(:receiveddate,'YYYY-MM-DD'))`,
               {
                 "content":content,
                 "award":award,
                 "director":director,
                 "receiveddate":req.body.receiveddate
               }
            );
          }
          result = await connection.execute(
            `commit`
          );
          dashboardinfo(req,res);
        }
      }
      else if (req.body.space==="actor" || req.body.space==="director") {
        let table ="";
        if (req.body.space==="actor") table = "actors";
        else if (req.body.space==="director") table = "directors";
        let name = req.body.name.toLowerCase();
        let dob = req.body.dob;
        let height = 0;
        if (req.body.space==="actor") height = req.body.height;
        let image = req.body.image.toLowerCase();
        let coverimage = req.body.coverimage.toLowerCase();
        let country = req.body.country;
        let description = req.body.description.toLowerCase();
        if (req.body.space==="actor") {
          result = await connection.execute(
            `select * from `+table+`
             where lower(name)=:name and lower(description)=:description and lower(image)=:image and lower(cover_image)=:coverimage and country_id=:country and date_of_birth=TO_DATE(:dob,'YYYY-MM-DD') and height=:height`,
             {
               "name":name,
               "dob":dob,
               "height":height,
               "image":image,
               "coverimage":coverimage,
               "country":country,
               "description":description
             }
          );
        }
        else if (req.body.space==="director") {
          result = await connection.execute(
            `select * from `+table+`
             where lower(name)=:name and lower(description)=:description and lower(image)=:image and lower(cover_image)=:coverimage and country_id=:country and date_of_birth=TO_DATE(:dob,'YYYY-MM-DD')`,
             {
               "name":name,
               "dob":dob,
               "image":image,
               "coverimage":coverimage,
               "country":country,
               "description":description
             }
          );
        }
        if (result.rows.length>0) {
          res.send({"status":true,"changeStatus":false});
        }
        else {
          result = await connection.execute(
            `select max(`+req.body.space+`_id) country_id from `+table+``
          );
          let country_id=(result.rows[0].COUNTRY_ID==null?1:result.rows[0].COUNTRY_ID+1);
          if (req.body.space==="actor") {
            result = await connection.execute(
              `insert into `+table+` values(:country_id,INITCAP(:name),TO_DATE(:dob,'YYYY-MM-DD'),:height,:description,:image,:coverimage,:country)`,
               {
                 "country_id":country_id,
                 "name":name,
                 "dob":dob,
                 "height":height,
                 "image":image,
                 "coverimage":coverimage,
                 "country":country,
                 "description":req.body.description
               }
            );
          }
          else if (req.body.space==="director") {
            result = await connection.execute(
              `insert into `+table+` values(:country_id,INITCAP(:name),TO_DATE(:dob,'YYYY-MM-DD'),:description,:image,:coverimage,:country)`,
               {
                 "country_id":country_id,
                 "name":name,
                 "dob":dob,
                 "image":image,
                 "coverimage":coverimage,
                 "country":country,
                 "description":req.body.description
               }
            );
          }
          result = await connection.execute(
            `commit`
          );
          dashboardinfo(req,res);
        }
      }
      else if (req.body.space==="content") {
        let table ="contents";
        let title = req.body.title.toLowerCase();
        let director = req.body.director;
        let studio = req.body.studio;
        let country = req.body.country;
        let language = req.body.language;
        let type = req.body.type;
        result = await connection.execute(
          `select * from `+table+`
           where lower(title)=:title and director_id=:director and studio_id=:studio and country_id=:country and language_id=:language and content_type=:type`,
           {
             "title":title,
             "director":director,
             "studio":studio,
             "country":country,
             "language":language,
             "type":type
           }
        );
        if (result.rows.length>0) {
          res.send({"status":true,"changeStatus":false});
        }
        else {
          result = await connection.execute(
            `select max(`+req.body.space+`_id) country_id from `+table+``
          );
          let country_id=(result.rows[0].COUNTRY_ID==null?1:result.rows[0].COUNTRY_ID+1);
          result = await connection.execute(
            `insert into `+table+` values(:country_id,INITCAP(:title),:language,0,0,:description,:country,:studio,:director,:type,:image,:trailer)`,
             {
               "country_id":country_id,
               "title":title,
               "director":director,
               "studio":studio,
               "country":country,
               "language":language,
               "type":type,
               "description":req.body.description,
               "image":req.body.image,
               "trailer":req.body.trailer
             }
          );
          if (type==="M") {
            result = await connection.execute(
              `insert into movies values(:country_id,:mduration,:mvideo,TO_DATE(:mreleasedate,'YYYY-MM-DD'))`,
               {
                 "country_id":country_id,
                 "mduration":req.body.mduration,
                 "mvideo":req.body.mvideo,
                 "mreleasedate":req.body.mreleasedate
               }
            );
          }
          else if (type==="T") {
            result = await connection.execute(
              `insert into tv_series values(:country_id,:ttvnetwork,TO_DATE(:tstartdate,'YYYY-MM-DD'),TO_DATE(:tenddate,'YYYY-MM-DD'))`,
               {
                 "country_id":country_id,
                 "ttvnetwork":req.body.ttvnetwork,
                 "tstartdate":req.body.tstartdate,
                 "tenddate":req.body.tenddate
               }
            );
          }
          result = await connection.execute(
            `commit`
          );
          dashboardinfo(req,res);
        }
      }

    }
    else {
      res.send({"status":false});
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getinfo(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from admins where admin_id=:admin_id and password=:password`,
      {
        "admin_id":req.body.admin_id,
        "password":req.body.password
      }
    );
    console.log(result.rows);
    if (result.rows.length>0) {
      let table = "";
      if (req.body.space==="award") table="awards";
      else if (req.body.space==="actor") table="actors";
      else if (req.body.space==="director") table="directors";
      else if (req.body.space==="content") table="contents";
      let data ={};
      result = await connection.execute(
        `select * from `+table+` where `+req.body.space+`_id=:award_id`,
        {
          "award_id":req.body.id
        }
      );
      data = result.rows[0];
      if (req.body.space==="actor" || req.body.space==="director") {
        result = await connection.execute(
          `select TO_CHAR(date_of_birth,'YYYY-MM-DD') date_of_birth from `+table+` where `+req.body.space+`_id=:award_id`,
          {
            "award_id":req.body.id
          }
        );
        data.DATE_OF_BIRTH = result.rows[0].DATE_OF_BIRTH;
      }
      let subdata = {};
      if (req.body.space==="content") {
        if (data.CONTENT_TYPE==="M") {
          result = await connection.execute(
            `select video,duration,TO_CHAR(release_date,'YYYY-MM-DD') release_date from movies where `+req.body.space+`_id=:award_id`,
            {
              "award_id":req.body.id
            }
          );
          subdata = result.rows[0];
        }
        else if (data.CONTENT_TYPE==="T") {
          result = await connection.execute(
            `select tv_network_id,TO_CHAR(start_date,'YYYY-MM-DD') start_date,TO_CHAR(end_date,'YYYY-MM-DD') end_date from tv_series where `+req.body.space+`_id=:award_id`,
            {
              "award_id":req.body.id
            }
          );
          subdata = result.rows[0];
        }
      }
      res.send({"status":true,"data":data,"subdata":subdata});

    }
    else {
      res.send({"status":false});
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function editinfo(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from admins where admin_id=:admin_id and password=:password`,
      {
        "admin_id":req.body.admin_id,
        "password":req.body.password
      }
    );
    console.log(result.rows);
    if (result.rows.length>0) {
      if (req.body.space==="country" || req.body.space==="language" || req.body.space==="genre" || req.body.space==="studio" || req.body.space==="tv_network") {
        let table ="";
        if (req.body.space==="country") table="countries";
        else if (req.body.space==="language") table="languages";
        else if (req.body.space==="genre") table="genres";
        else if (req.body.space==="studio") table="studios";
        else if (req.body.space==="tv_network") table="tv_networks";
        if (req.body.deletename) {
          result = await connection.execute(
            `delete from `+table+` where `+req.body.space+`_id=:country_id`,
             {
               "country_id":req.body.id
             }
          );
          result = await connection.execute(
            `commit`
          );
          dashboardinfo(req,res);
        }
        else {
          let country = req.body.name.toLowerCase();
          result = await connection.execute(
            `select * from `+table+`
             where lower(name)=:country and `+req.body.space+`_id!=:country_id`,
             {
               "country":country,
               "country_id":req.body.id
             }
          );
          if (result.rows.length>0) {
            res.send({"status":true,"changeStatus":false});
          }
          else {
            result = await connection.execute(
              `update `+table+` set name=INITCAP(:country) where `+req.body.space+`_id=:country_id`,
               {
                 "country":country,
                 "country_id":req.body.id
               }
            );
            result = await connection.execute(
              `commit`
            );
            dashboardinfo(req,res);
          }
        }
      }
      else if (req.body.space==="award") {
        let table ="awards";
        if (req.body.deletename) {
          result = await connection.execute(
            `delete from `+table+` where `+req.body.space+`_id=:country_id`,
             {
               "country_id":req.body.id
             }
          );
          result = await connection.execute(
            `commit`
          );
          dashboardinfo(req,res);
        }
        else {
          let country = req.body.name.toLowerCase();
          let issuedby = req.body.issuedby.toLowerCase();
          result = await connection.execute(
            `select * from `+table+`
             where lower(name)=:country and lower(issued_by)=:issuedby and `+req.body.space+`_id!=:country_id`,
             {
               "country":country,
               "issuedby":issuedby,
               "country_id":req.body.id
             }
          );
          if (result.rows.length>0) {
            res.send({"status":true,"changeStatus":false});
          }
          else {
            result = await connection.execute(
              `update `+table+` set name=INITCAP(:country),issued_by=INITCAP(:issuedby) where `+req.body.space+`_id=:country_id`,
               {
                 "country":country,
                 "issuedby":issuedby,
                 "country_id":req.body.id
               }
            );
            result = await connection.execute(
              `commit`
            );
            dashboardinfo(req,res);
          }
        }
      }
      else if (req.body.space==="actor" || req.body.space==="director") {
        let table ="";
        if (req.body.space==="actor") table="actors";
        else if (req.body.space==="director") table="directors";
        if (req.body.deletename) {
          result = await connection.execute(
            `delete from `+table+` where `+req.body.space+`_id=:country_id`,
             {
               "country_id":req.body.id
             }
          );
          result = await connection.execute(
            `commit`
          );
          dashboardinfo(req,res);
        }
        else {
          let country_id = req.body.id;
          let name = req.body.name.toLowerCase();
          let dob = req.body.dob;
          let height = 0;
          if (req.body.space==="actor") height = req.body.height;
          let image = req.body.image.toLowerCase();
          let coverimage = req.body.coverimage.toLowerCase();
          let country = req.body.country;
          let description = req.body.description.toLowerCase();
          if (req.body.space==="actor") {
            result = await connection.execute(
              `select * from `+table+`
               where lower(name)=:name and lower(description)=:description and lower(image)=:image and lower(cover_image)=:coverimage and country_id=:country and date_of_birth=TO_DATE(:dob,'YYYY-MM-DD') and height=:height and `+req.body.space+`_id!=:country_id`,
               {
                 "name":name,
                 "dob":dob,
                 "height":height,
                 "image":image,
                 "coverimage":coverimage,
                 "country":country,
                 "description":description,
                 "country_id":country_id
               }
            );
          }
          else if (req.body.space==="director") {
            result = await connection.execute(
              `select * from `+table+`
               where lower(name)=:name and lower(description)=:description and lower(image)=:image and lower(cover_image)=:coverimage and country_id=:country and date_of_birth=TO_DATE(:dob,'YYYY-MM-DD') and `+req.body.space+`_id!=:country_id`,
               {
                 "name":name,
                 "dob":dob,
                 "image":image,
                 "coverimage":coverimage,
                 "country":country,
                 "description":description,
                 "country_id":country_id
               }
            );
          }
          if (result.rows.length>0) {
            res.send({"status":true,"changeStatus":false});
          }
          else {
            if (req.body.space==="actor") {
              result = await connection.execute(
                `update `+table+` set name=INITCAP(:name),date_of_birth=TO_DATE(:dob,'YYYY-MM-DD'),height=:height,image=:image,cover_image=:coverimage,description=:description,country_id=:country where `+req.body.space+`_id=:country_id`,
                 {
                   "country_id":country_id,
                   "name":name,
                   "dob":dob,
                   "height":height,
                   "image":image,
                   "coverimage":coverimage,
                   "country":country,
                   "description":req.body.description
                 }
              );
            }
            else if (req.body.space==="director") {
              result = await connection.execute(
                `update `+table+` set name=INITCAP(:name),date_of_birth=TO_DATE(:dob,'YYYY-MM-DD'),image=:image,cover_image=:coverimage,description=:description,country_id=:country where `+req.body.space+`_id=:country_id`,
                 {
                   "country_id":country_id,
                   "name":name,
                   "dob":dob,
                   "image":image,
                   "coverimage":coverimage,
                   "country":country,
                   "description":req.body.description
                 }
              );
            }
            result = await connection.execute(
              `commit`
            );
            dashboardinfo(req,res);
          }
        }
      }
      else if (req.body.space==="content") {
        let table ="contents";
        if (req.body.deletename) {
          result = await connection.execute(
            `delete from `+table+` where `+req.body.space+`_id=:country_id`,
             {
               "country_id":req.body.id
             }
          );
          result = await connection.execute(
            `commit`
          );
          dashboardinfo(req,res);
        }
        else {
          let title = req.body.title.toLowerCase();
          let director = req.body.director;
          let studio = req.body.studio;
          let country = req.body.country;
          let language = req.body.language;
          let type = req.body.type;
          result = await connection.execute(
            `select * from `+table+`
             where lower(title)=:title and director_id=:director and studio_id=:studio and country_id=:country and language_id=:language and content_type=:type and `+req.body.space+`_id!=:country_id`,
             {
               "title":title,
               "director":director,
               "studio":studio,
               "country":country,
               "language":language,
               "type":type,
               "country_id":req.body.id
             }
          );
          if (result.rows.length>0) {
            res.send({"status":true,"changeStatus":false});
          }
          else {
            result = await connection.execute(
              `update `+table+` set title=INITCAP(:title),image=:image,trailer=:trailer,language_id=:language,country_id=:country,studio_id=:studio,director_id=:director,description=:description,content_type=:type where `+req.body.space+`_id=:country_id`,
               {
                 "title":title,
                 "director":director,
                 "studio":studio,
                 "country":country,
                 "language":language,
                 "type":type,
                 "description":req.body.description,
                 "image":req.body.image,
                 "trailer":req.body.trailer,
                 "country_id":req.body.id
               }
            );
            if (type==="M") {
              result = await connection.execute(
                `delete from tv_series where `+req.body.space+`_id=:country_id`,
                 {
                   "country_id":req.body.id
                 }
              );
              result = await connection.execute(
                `select * from movies where `+req.body.space+`_id=:country_id`,
                 {
                   "country_id":req.body.id
                 }
              );
              if (result.rows.length>0) {
                result = await connection.execute(
                  `update movies set duration=:mduration,video=:mvideo,release_date=TO_DATE(:mreleasedate,'YYYY-MM-DD') where `+req.body.space+`_id=:country_id`,
                   {
                     "country_id":req.body.id,
                     "mduration":req.body.mduration,
                     "mvideo":req.body.mvideo,
                     "mreleasedate":req.body.mreleasedate
                   }
                );
              }
              else {
                result = await connection.execute(
                  `insert into movies values(:country_id,:mduration,:mvideo,TO_DATE(:mreleasedate,'YYYY-MM-DD'))`,
                   {
                     "country_id":req.body.id,
                     "mduration":req.body.mduration,
                     "mvideo":req.body.mvideo,
                     "mreleasedate":req.body.mreleasedate
                   }
                );
              }
            }
            else if (type==="T") {
              result = await connection.execute(
                `delete from movies where `+req.body.space+`_id=:country_id`,
                 {
                   "country_id":req.body.id
                 }
              );
              result = await connection.execute(
                `select * from tv_series where `+req.body.space+`_id=:country_id`,
                 {
                   "country_id":req.body.id
                 }
              );
              if (result.rows.length>0) {
                result = await connection.execute(
                  `update tv_series set tv_network_id=:ttvnetwork,start_date=TO_DATE(:tstartdate,'YYYY-MM-DD'),end_date=TO_DATE(:tenddate,'YYYY-MM-DD') where `+req.body.space+`_id=:country_id`,
                   {
                     "country_id":req.body.id,
                     "ttvnetwork":req.body.ttvnetwork,
                     "tstartdate":req.body.tstartdate,
                     "tenddate":req.body.tenddate
                   }
                );
              }
              else {
                result = await connection.execute(
                  `insert into tv_series values(:country_id,:ttvnetwork,TO_DATE(:tstartdate,'YYYY-MM-DD'),TO_DATE(:tenddate,'YYYY-MM-DD'))`,
                   {
                     "country_id":req.body.id,
                     "ttvnetwork":req.body.ttvnetwork,
                     "tstartdate":req.body.tstartdate,
                     "tenddate":req.body.tenddate
                   }
                );
              }
            }
            result = await connection.execute(
              `commit`
            );
            dashboardinfo(req,res);
          }
        }
      }
    }
    else {
      res.send({"status":false});
    }
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


async function register(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select max(user_id) user_id from users`
    );
    let userCount=(result.rows[0].USER_ID==null?1:result.rows[0].USER_ID+1);
    result = await connection.execute(
      `INSERT INTO Users
      VALUES(:userCount,:name,:email,:password,TO_DATE(:date_of_birth,'YYYY-MM-DD'),:gender,SYSDATE,:country)`,
      {"userCount":userCount,
       "name":req.body.name,
       "email":req.body.email,
       "password":req.body.password,
       "date_of_birth":req.body.date_of_birth,
       "gender":req.body.gender,
       "country":req.body.country}
    );
    console.log(result.rows);
    await connection.execute(
      `COMMIT`
    );
    result = await connection.execute(
      `select max(session_id) session_id from sessions`
    );
    let session_id=(result.rows[0].SESSION_ID==null?1:result.rows[0].SESSION_ID+1);
    result = await connection.execute(
      `INSERT INTO Sessions
      VALUES(:session_id,:userCount)`,
      { "session_id":session_id,
        "userCount":userCount
       }
    );
    await connection.execute(
      `COMMIT`
    );
    res.send({"status":true,"subscriptionStatus":false, "session_id":session_id});
  } catch (err) {
    console.error(err);
    res.send({"status":false});
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function logout(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `delete from sessions where session_id=:session_id`,
        {
          "session_id": req.headers.authorization
        }
      );
      await connection.execute(
        `COMMIT`
      );
      console.log("deleted session "+req.headers.authorization);
      res.send({"status":true});
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function browseinfo(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    console.log(req.headers.authorization);
    console.log(result);
    console.log(req.body);
    if (result.rows.length>0) {
      console.log("user found");
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          let profile_name = result.rows[0].NAME;
          let content_id = 0;
          let randomGenre = "genre";
          if (req.body.space==="home") {
            result = await connection.execute(
              `select content_id from contents`
            );
            if (result.rows.length>0) {
              content_id = result.rows[Math.floor(Math.random()*result.rows.length)].CONTENT_ID;
            }
            result = await connection.execute(
              `select distinct name from contents JOIN content_genre USING(content_id) JOIN genres USING(genre_id)`
            );
            if (result.rows.length>0) {
              randomGenre += result.rows[Math.floor(Math.random()*result.rows.length)].NAME;
            }
          }
          else if (req.body.space==="movie") {
            result = await connection.execute(
              `select content_id from contents where content_type='M'`
            );
            if (result.rows.length>0) {
              content_id = result.rows[Math.floor(Math.random()*result.rows.length)].CONTENT_ID;
            }
            result = await connection.execute(
              `select distinct name from contents JOIN content_genre USING(content_id) JOIN genres USING(genre_id) where content_type='M'`
            );
            if (result.rows.length>0) {
              randomGenre += result.rows[Math.floor(Math.random()*result.rows.length)].NAME;
            }
          }
          else if (req.body.space==="tv") {
            result = await connection.execute(
              `select content_id from contents where content_type='T'`
            );
            if (result.rows.length>0) {
              content_id = result.rows[Math.floor(Math.random()*result.rows.length)].CONTENT_ID;
            }
            result = await connection.execute(
              `select distinct name from contents JOIN content_genre USING(content_id) JOIN genres USING(genre_id) where content_type='T'`
            );
            if (result.rows.length>0) {
              randomGenre += result.rows[Math.floor(Math.random()*result.rows.length)].NAME;
            }
          }
          else if (req.body.space==="mylist") {
            content_id = 0;
          }
          let rowTitle =[
            {"ID":1,"TITLE":"continue"},
            {"ID":2,"TITLE":"new release"},
            {"ID":3,"TITLE":"preference"},
            {"ID":4,"TITLE":"top rated"},
            {"ID":5,"TITLE":"top country"},
            {"ID":6,"TITLE":randomGenre},
            {"ID":7,"TITLE":"trending"},
          ];
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"profile_name":profile_name,"content_id":content_id,"rowTitle":rowTitle});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      console.log("sending false");
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getbannercontent(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          result = await connection.execute(
            `select title,description,trailer,content_type from contents where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let title = result.rows[0].TITLE;
          let description = result.rows[0].DESCRIPTION;
          let trailer = result.rows[0].TRAILER;
          let already_played=false;
          if (result.rows[0].CONTENT_TYPE==="M") {
            result = await connection.execute(
              `select * from watched_movies where content_id=:content_id and profile_id=:profile_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
            if (result.rows.length>0) already_played=true;
          }
          else {
            result = await connection.execute(
              `select * from watched_episodes where content_id=:content_id and profile_id=:profile_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
            if (result.rows.length>0) already_played=true;
          }

          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"content_details":{"TITLE":title,"DESCRIPTION":description,"TRAILER":trailer,"already_played":already_played}});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getshortcontent(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {

          result = await connection.execute(
            `select image,content_type from contents where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let image = result.rows[0].IMAGE;
          let info="";
          let already_played = false;
          if (result.rows[0].CONTENT_TYPE==="M") {
            result = await connection.execute(
              `select (TRUNC(duration/60, 0) || ' minute') duration from movies where content_id=:content_id`,
              {
                "content_id":req.body.content_id
              }
            );
            info = result.rows[0].DURATION;
            result = await connection.execute(
              `select * from watched_movies where content_id=:content_id and profile_id=:profile_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
            if (result.rows.length>0) already_played=true;
          }
          else {
            result = await connection.execute(
              `select (max(season_no) || ' season') max_season_no from episodes where content_id=:content_id`,
              {
                "content_id":req.body.content_id
              }
            );
            info = result.rows[0].MAX_SEASON_NO;
            result = await connection.execute(
              `select * from watched_episodes where content_id=:content_id and profile_id=:profile_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
            if (result.rows.length>0) already_played=true;
          }
          result = await connection.execute(
            `select name from genres JOIN content_genre using(genre_id) where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let genre = "";
          for (let i=0;i<result.rows.length;i++) {
            genre+=result.rows[i].NAME;
            if (i!=result.rows.length-1) genre+=" | ";
          }
          let added = false;
          result = await connection.execute(
            `select * from watch_list where content_id=:content_id and profile_id=:profile_id`,
            {
              "content_id":req.body.content_id,
              "profile_id":req.body.profile_id
            }
          );
          if (result.rows.length>0) added = true;
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"details":{"image":image,"info":info,"genre":genre,"added":added,"already_played":already_played}});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getmylistcontent(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          let movies = [];
          let tvseries = [];
          let genre = [];
          result = await connection.execute(
            `select content_id from watch_list JOIN contents USING(content_id) where profile_id=:profile_id and content_type='M'`,
            {
              "profile_id": req.body.profile_id
            }
          );
          movies = result.rows;
          result = await connection.execute(
            `select content_id from watch_list JOIN contents USING(content_id) where profile_id=:profile_id and content_type='T'`,
            {
              "profile_id": req.body.profile_id
            }
          );
          tvseries = result.rows;
          result = await connection.execute(
            `select genre_id,name from preference JOIN genres USING(genre_id)
             where profile_id=:profile_id`,
            {
              "profile_id": req.body.profile_id
            }
          );
          genre = result.rows;
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"details":{"movies":movies,"tvseries":tvseries,"genre":genre}});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getsearchcontent(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          let contents = [];
          let value = "'%"+req.body.value+"%'";
          value = value.toLowerCase();
          if (req.body.space==="home") {
            result = await connection.execute(
              `(select content_id from contents
               where lower(title) like `+value+`)
               UNION
               (select content_id from actors JOIN acted USING(actor_id)
               where lower(name) like `+value+`)
               UNION
               (select content_id from contents JOIN directors USING(director_id)
               where lower(name) like `+value+`)
               UNION
               (select content_id from genres JOIN content_genre USING(genre_id)
               where lower(name) like `+value+`)
               UNION
               (select content_id from contents JOIN languages USING(language_id)
               where lower(name) like `+value+`)
               UNION
               (select content_id from contents JOIN studios USING(studio_id)
               where lower(name) like `+value+`)
               UNION
               (select content_id from tv_series JOIN tv_networks USING(tv_network_id)
               where lower(name) like `+value+`)`
            );
            contents = result.rows;
          }
          else if (req.body.space==="movie") {
            result = await connection.execute(
              `(select content_id from contents
               where lower(title) like `+value+` and content_type='M')
               UNION
               (select content_id from actors JOIN acted USING(actor_id) JOIN contents USING(content_id)
               where lower(name) like `+value+` and content_type='M')
               UNION
               (select content_id from contents JOIN directors USING(director_id)
               where lower(name) like `+value+` and content_type='M')
               UNION
               (select content_id from genres JOIN content_genre USING(genre_id) JOIN contents USING(content_id)
               where lower(name) like `+value+` and content_type='M')
               UNION
               (select content_id from contents JOIN languages USING(language_id)
               where lower(name) like `+value+` and content_type='M')
               UNION
               (select content_id from contents JOIN studios USING(studio_id)
               where lower(name) like `+value+` and content_type='M')`
            );
            contents = result.rows;
          }
          else if (req.body.space==="tv") {
            result = await connection.execute(
              `(select content_id from contents
               where lower(title) like `+value+` and content_type='T')
               UNION
               (select content_id from actors JOIN acted USING(actor_id) JOIN contents USING(content_id)
               where lower(name) like `+value+` and content_type='T')
               UNION
               (select content_id from contents JOIN directors USING(director_id)
               where lower(name) like `+value+` and content_type='T')
               UNION
               (select content_id from genres JOIN content_genre USING(genre_id) JOIN contents USING(content_id)
               where lower(name) like `+value+` and content_type='T')
               UNION
               (select content_id from contents JOIN languages USING(language_id)
               where lower(name) like `+value+` and content_type='T')
               UNION
               (select content_id from contents JOIN studios USING(studio_id)
               where lower(name) like `+value+` and content_type='T')
               UNION
               (select content_id from tv_series JOIN tv_networks USING(tv_network_id)
               where lower(name) like `+value+`)`
            );
            contents = result.rows;
          }
          else if (req.body.space==="mylist") {
            result = await connection.execute(
              `(select content_id from contents JOIN watch_list USING(content_id)
               where lower(title) like `+value+` and profile_id=:profile_id)
               UNION
               (select content_id from actors JOIN acted USING(actor_id) JOIN watch_list USING(content_id)
               where lower(name) like `+value+` and profile_id=:profile_id)
               UNION
               (select content_id from contents JOIN directors USING(director_id) JOIN watch_list USING(content_id)
               where lower(name) like `+value+` and profile_id=:profile_id)
               UNION
               (select content_id from genres JOIN content_genre USING(genre_id) JOIN watch_list USING(content_id)
               where lower(name) like `+value+` and profile_id=:profile_id)
               UNION
               (select content_id from contents JOIN languages USING(language_id) JOIN watch_list USING(content_id)
               where lower(name) like `+value+` and profile_id=:profile_id)
               UNION
               (select content_id from contents JOIN studios USING(studio_id) JOIN watch_list USING(content_id)
               where lower(name) like `+value+` and profile_id=:profile_id)
               UNION
               (select content_id from tv_series JOIN tv_networks USING(tv_network_id) JOIN watch_list USING(content_id)
               where lower(name) like `+value+` and profile_id=:profile_id)`,
               {
                 "profile_id":req.body.profile_id
               }
            );
            contents = result.rows;
          }
          console.log(contents);
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"contents":contents});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getplayvideo(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          result = await connection.execute(
            `select title,content_type from contents where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let title = result.rows[0].TITLE;
          let video = "";
          let seek_time = 0;
          let season_no = 0;
          let episode_no = 0;
          if (result.rows[0].CONTENT_TYPE==="M") {
            result = await connection.execute(
              `select video from movies where content_id=:content_id`,
              {
                "content_id":req.body.content_id
              }
            );
            video = result.rows[0].VIDEO;
            result = await connection.execute(
              `select duration from watched_movies where content_id=:content_id and profile_id=:profile_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
            if (result.rows.length>0) seek_time = result.rows[0].DURATION;
            season_no = 0;
            episode_no = 0;
          }
          else {
            if (req.body.season_no!=0 && req.body.episode_no!=0) {
              result = await connection.execute(
                `select title,video from episodes where content_id=:content_id and season_no=:season_no and episode_no=:episode_no`,
                {
                  "content_id":req.body.content_id,
                  "season_no":req.body.season_no,
                  "episode_no":req.body.episode_no
                }
              );
              title += " S"+(req.body.season_no<10?"0"+req.body.season_no:req.body.season_no)+"E"+(req.body.episode_no<10?"0"+req.body.episode_no:req.body.episode_no)+" - "+result.rows[0].TITLE;
              video = result.rows[0].VIDEO;
              result = await connection.execute(
                `select duration from watched_episodes where content_id=:content_id and profile_id=:profile_id and season_no=:season_no and episode_no=:episode_no`,
                {
                  "content_id":req.body.content_id,
                  "profile_id":req.body.profile_id,
                  "season_no":req.body.season_no,
                  "episode_no":req.body.episode_no
                }
              );
              if (result.rows.length>0) seek_time = result.rows[0].DURATION;
              season_no = req.body.season_no;
              episode_no = req.body.episode_no;
            }
            else {
              season_no = 1;
              episode_no = 1;
              result = await connection.execute(
                `select season_no,episode_no,duration from watched_episodes
                where content_id=:content_id and profile_id=:profile_id
                order by season_no desc,episode_no desc`,
                {
                  "content_id":req.body.content_id,
                  "profile_id":req.body.profile_id
                }
              );
              if (result.rows.length>0) {
                season_no = result.rows[0].SEASON_NO;
                episode_no = result.rows[0].EPISODE_NO;
                seek_time = result.rows[0].DURATION;
              }
              result = await connection.execute(
                `select title,video from episodes where content_id=:content_id and season_no=:season_no and episode_no=:episode_no`,
                {
                  "content_id":req.body.content_id,
                  "season_no":season_no,
                  "episode_no":episode_no
                }
              );
              title += " S"+(season_no<10?"0"+season_no:season_no)+"E"+(episode_no<10?"0"+episode_no:episode_no)+" - "+result.rows[0].TITLE;
              video = result.rows[0].VIDEO;
            }
          }
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"details":{"title":title,"video":video,"seek_time":seek_time,"season_no":season_no,"episode_no":episode_no}});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function submitplayprogress(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          result = await connection.execute(
            `select content_type from contents where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          if (result.rows[0].CONTENT_TYPE==="M") {
            result = await connection.execute(
              `select * from watched_movies where content_id=:content_id and profile_id=:profile_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
            if (result.rows.length>0) {
              result = await connection.execute(
                `update watched_movies set duration=trunc(:play_time,0),access_date=sysdate where content_id=:content_id and profile_id=:profile_id`,
                {
                  "content_id":req.body.content_id,
                  "profile_id":req.body.profile_id,
                  "play_time":req.body.play_time
                }
              );
            }
            else {
              result = await connection.execute(
                `insert into watched_movies values(:profile_id,:content_id,trunc(:play_time,0),sysdate)`,
                {
                  "content_id":req.body.content_id,
                  "profile_id":req.body.profile_id,
                  "play_time":req.body.play_time
                }
              );
            }
            result = await connection.execute(
              `commit`
            );
          }
          else {
            console.log(req.body);
            result = await connection.execute(
              `select * from watched_episodes where content_id=:content_id and profile_id=:profile_id and season_no=:season_no and episode_no=:episode_no`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id,
                "season_no":req.body.season_no,
                "episode_no":req.body.episode_no
              }
            );
            if (result.rows.length>0) {
              result = await connection.execute(
                `update watched_episodes set duration=trunc(:play_time,0),access_date=sysdate where content_id=:content_id and profile_id=:profile_id and season_no=:season_no and episode_no=:episode_no`,
                {
                  "content_id":req.body.content_id,
                  "profile_id":req.body.profile_id,
                  "play_time":req.body.play_time,
                  "season_no":req.body.season_no,
                  "episode_no":req.body.episode_no
                }
              );
            }
            else {
              result = await connection.execute(
                `insert into watched_episodes values(:profile_id,:content_id,:season_no,:episode_no,trunc(:play_time,0),sysdate)`,
                {
                  "profile_id":req.body.profile_id,
                  "content_id":req.body.content_id,
                  "season_no":req.body.season_no,
                  "episode_no":req.body.episode_no,
                  "play_time":req.body.play_time
                }
              );
            }
            result = await connection.execute(
              `commit`
            );

          }
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function checkreviewstatus(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          let name = "";
          result = await connection.execute(
            `select title,content_type from contents where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          name = result.rows[0].TITLE;
          //
          let nextStatus = false;
          let title = result.rows[0].TITLE;
          let video = "";
          let seek_time = 0;
          let season_no = 0;
          let episode_no = 0;
          if (result.rows[0].CONTENT_TYPE==="M") {
            nextStatus = false;
          }
          else {
            result = await connection.execute(
              `select title,video from episodes where content_id=:content_id and season_no=:season_no and episode_no=:episode_no`,
              {
                "content_id":req.body.content_id,
                "season_no": req.body.season_no,
                "episode_no": req.body.episode_no+1
              }
            );
            if (result.rows.length>0) {
              nextStatus = true;
              season_no = req.body.season_no;
              episode_no = req.body.episode_no+1;
              title += " S"+(season_no<10?"0"+season_no:season_no)+"E"+(episode_no<10?"0"+episode_no:episode_no)+" - "+result.rows[0].TITLE;
              video = result.rows[0].VIDEO;
            }
            else {
              result = await connection.execute(
                `select title,video from episodes where content_id=:content_id and season_no=:season_no and episode_no=:episode_no`,
                {
                  "content_id":req.body.content_id,
                  "season_no": req.body.season_no+1,
                  "episode_no": 1
                }
              );
              if (result.rows.length>0) {
                nextStatus = true;
                season_no = req.body.season_no+1;
                episode_no = 1;
                title += " S"+(season_no<10?"0"+season_no:season_no)+"E"+(episode_no<10?"0"+episode_no:episode_no)+" - "+result.rows[0].TITLE;
                video = result.rows[0].VIDEO;
              }
              else {
                nextStatus = false;
              }
            }
            result = await connection.execute(
              `select duration from watched_episodes where content_id=:content_id and profile_id=:profile_id and season_no=:season_no and episode_no=:episode_no`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id,
                "season_no":season_no,
                "episode_no":episode_no
              }
            );
            if (result.rows.length>0) seek_time = result.rows[0].DURATION;
          }
          //
          let reviewdone = false;
          result = await connection.execute(
            `select * from reviewed where content_id=:content_id and profile_id=:profile_id`,
            {
              "content_id":req.body.content_id,
              "profile_id":req.body.profile_id
            }
          );
          if (result.rows.length>0) reviewdone = true;
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"details":{"name":name,"reviewdone":reviewdone,"nextStatus":nextStatus,"nextDetails":{"title":title,"video":video,"seek_time":seek_time,"season_no":season_no,"episode_no":episode_no}}});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function submitreview(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          result = await connection.execute(
            `insert into reviewed values(:profile_id,:content_id,:rating,sysdate)`,
            {
              "profile_id": req.body.profile_id,
              "content_id": req.body.content_id,
              "rating": req.body.rating
            }
          );
          result = await connection.execute(
            `commit`
          );
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function changemylist(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          if (req.body.operation==="A") {
            result = await connection.execute(
              `insert into watch_list values(:profile_id,:content_id)`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
          }
          else if (req.body.operation==="R") {
            result = await connection.execute(
              `delete from watch_list where profile_id=:profile_id and content_id=:content_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
          }
          result = await connection.execute(
            `commit`
          );
          result = await connection.execute(
            `select image,content_type from contents where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let image = result.rows[0].IMAGE;
          let info="";
          let already_played = false;
          if (result.rows[0].CONTENT_TYPE==="M") {
            result = await connection.execute(
              `select (TRUNC(duration/60, 0) || ' minute') duration from movies where content_id=:content_id`,
              {
                "content_id":req.body.content_id
              }
            );
            info = result.rows[0].DURATION;
            result = await connection.execute(
              `select * from watched_movies where content_id=:content_id and profile_id=:profile_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
            if (result.rows.length>0) already_played=true;
          }
          else {
            result = await connection.execute(
              `select (max(season_no) || ' season') max_season_no from episodes where content_id=:content_id`,
              {
                "content_id":req.body.content_id
              }
            );
            info = result.rows[0].MAX_SEASON_NO;
            result = await connection.execute(
              `select * from watched_episodes where content_id=:content_id and profile_id=:profile_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
            if (result.rows.length>0) already_played=true;
          }
          result = await connection.execute(
            `select name from genres JOIN content_genre using(genre_id) where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let genre = "";
          for (let i=0;i<result.rows.length;i++) {
            genre+=result.rows[i].NAME;
            if (i!=result.rows.length-1) genre+=" | ";
          }
          let added = false;
          result = await connection.execute(
            `select * from watch_list where content_id=:content_id and profile_id=:profile_id`,
            {
              "content_id":req.body.content_id,
              "profile_id":req.body.profile_id
            }
          );
          if (result.rows.length>0) added = true;
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"details":{"image":image,"info":info,"genre":genre,"added":added,"already_played":already_played}});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getfullcontent(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          console.log("getting full content"+req.body.content_id);
          result = await connection.execute(
            `select title,languages.name language,rating,rated_by,description,countries.name cname,studios.name sname,director_id,content_type,trailer
            from contents JOIN countries USING(country_id) JOIN studios USING(studio_id) JOIN languages USING(language_id)
            where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let common = result.rows[0];
          let info="";
          let release_date = "";
          let tv_network = "";
          let episodes = [];
          let seasons = [];
          let already_played = false;
          if (common.CONTENT_TYPE==="M") {
            result = await connection.execute(
              `select (TRUNC(duration/60, 0) || ' minute') duration,TO_CHAR(release_date,'DD Mon, YYYY') release_date from movies where content_id=:content_id`,
              {
                "content_id":req.body.content_id
              }
            );
            info = result.rows[0].DURATION;
            release_date = result.rows[0].RELEASE_DATE;
            tv_network = "";
            episodes = [];
            seasons = [];
            result = await connection.execute(
              `select * from watched_movies where content_id=:content_id and profile_id=:profile_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
            if (result.rows.length>0) already_played=true;
          }
          else {
            result = await connection.execute(
              `select (max(season_no) || ' season') max_season_no from episodes where content_id=:content_id`,
              {
                "content_id":req.body.content_id
              }
            );
            info = result.rows[0].MAX_SEASON_NO;
            result = await connection.execute(
              `select name tv_network,TO_CHAR(start_date,'DD Mon, YYYY') || ' - ' || TO_CHAR(end_date,'DD Mon, YYYY') release_date from tv_series JOIN tv_networks USING(tv_network_id) where content_id=:content_id`,
              {
                "content_id":req.body.content_id
              }
            );
            release_date = result.rows[0].RELEASE_DATE;
            tv_network = result.rows[0].TV_NETWORK;
            result = await connection.execute(
              `select * from episodes
              where content_id=:content_id
              order by season_no,episode_no`,
              {
                "content_id":req.body.content_id
              }
            );
            episodes = result.rows;
            result = await connection.execute(
              `select distinct season_no from episodes
              where content_id=:content_id
              order by season_no`,
              {
                "content_id":req.body.content_id
              }
            );
            seasons = result.rows;
            result = await connection.execute(
              `select * from watched_episodes where content_id=:content_id and profile_id=:profile_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
            if (result.rows.length>0) already_played=true;
          }
          console.log("done");
          result = await connection.execute(
            `select name from genres JOIN content_genre using(genre_id) where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let genre = "";
          for (let i=0;i<result.rows.length;i++) {
            genre+=result.rows[i].NAME;
            if (i!=result.rows.length-1) genre+=" | ";
          }
          let added = false;
          result = await connection.execute(
            `select * from watch_list where content_id=:content_id and profile_id=:profile_id`,
            {
              "content_id":req.body.content_id,
              "profile_id":req.body.profile_id
            }
          );
          if (result.rows.length>0) added = true;
          result = await connection.execute(
            `select actor_id from acted where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let cast = result.rows;
          result = await connection.execute(
            `select award_id,name aname,issued_by,TO_CHAR(received_date,'YYYY') year,null to_name,null to_id,null to_type
             from content_received JOIN awards USING(award_id) where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let awards = result.rows;
          console.log(result.rows);
          result = await connection.execute(
            `select award_id,awards.name aname,issued_by,TO_CHAR(received_date,'YYYY') year,actors.name to_name,actor_id to_id,'A' to_type
             from actor_received JOIN awards USING(award_id) JOIN actors USING(actor_id) where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          awards = awards.concat(result.rows);
          //console.log(result.rows);
          result = await connection.execute(
            `select award_id,awards.name aname,issued_by,TO_CHAR(received_date,'YYYY') year,directors.name to_name,director_id to_id,'D' to_type
             from director_received JOIN awards USING(award_id) JOIN directors USING(director_id) where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          awards = awards.concat(result.rows);
          //console.log(result.rows);
          result = await connection.execute(
            `(select content_id2 content_id from similar_contents where content_id1=:content_id)
             UNION
             (select content_id1 content_id from similar_contents where content_id2=:content_id)`,
            {
              "content_id":req.body.content_id
            }
          );
          let similar_contents=result.rows;
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"details":{"common":common,"info":info,"genre":genre,"added":added,"already_played":already_played,"release_date":release_date,"tv_network":tv_network,"awards":awards,"cast":cast,"seasons":seasons,"episodes":episodes,"similar_contents":similar_contents}});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function changemylistfull(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          if (req.body.operation==="A") {
            result = await connection.execute(
              `insert into watch_list values(:profile_id,:content_id)`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
          }
          else if (req.body.operation==="R") {
            result = await connection.execute(
              `delete from watch_list where profile_id=:profile_id and content_id=:content_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
          }
          result = await connection.execute(
            `commit`
          );
          result = await connection.execute(
            `select title,languages.name language,rating,rated_by,description,countries.name cname,studios.name sname,director_id,content_type,trailer
            from contents JOIN countries USING(country_id) JOIN studios USING(studio_id) JOIN languages USING(language_id)
            where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let common = result.rows[0];
          let info="";
          let release_date = "";
          let tv_network = "";
          let episodes = [];
          let seasons = [];
          let already_played = false;
          if (common.CONTENT_TYPE==="M") {
            result = await connection.execute(
              `select (TRUNC(duration/60, 0) || ' minute') duration,TO_CHAR(release_date,'DD Mon, YYYY') release_date from movies where content_id=:content_id`,
              {
                "content_id":req.body.content_id
              }
            );
            info = result.rows[0].DURATION;
            release_date = result.rows[0].RELEASE_DATE;
            tv_network = "";
            episodes = [];
            seasons = [];
            result = await connection.execute(
              `select * from watched_movies where content_id=:content_id and profile_id=:profile_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
            if (result.rows.length>0) already_played=true;
          }
          else {
            result = await connection.execute(
              `select (max(season_no) || ' season') max_season_no from episodes where content_id=:content_id`,
              {
                "content_id":req.body.content_id
              }
            );
            info = result.rows[0].MAX_SEASON_NO;
            result = await connection.execute(
              `select name tv_network,TO_CHAR(start_date,'DD Mon, YYYY') || ' - ' || TO_CHAR(end_date,'DD Mon, YYYY') release_date from tv_series JOIN tv_networks USING(tv_network_id) where content_id=:content_id`,
              {
                "content_id":req.body.content_id
              }
            );
            release_date = result.rows[0].RELEASE_DATE;
            tv_network = result.rows[0].TV_NETWORK;
            result = await connection.execute(
              `select * from episodes
              where content_id=:content_id
              order by season_no,episode_no`,
              {
                "content_id":req.body.content_id
              }
            );
            episodes = result.rows;
            result = await connection.execute(
              `select distinct season_no from episodes
              where content_id=:content_id
              order by season_no`,
              {
                "content_id":req.body.content_id
              }
            );
            seasons = result.rows;
            result = await connection.execute(
              `select * from watched_episodes where content_id=:content_id and profile_id=:profile_id`,
              {
                "content_id":req.body.content_id,
                "profile_id":req.body.profile_id
              }
            );
            if (result.rows.length>0) already_played=true;
          }
          console.log("done");
          result = await connection.execute(
            `select name from genres JOIN content_genre using(genre_id) where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let genre = "";
          for (let i=0;i<result.rows.length;i++) {
            genre+=result.rows[i].NAME;
            if (i!=result.rows.length-1) genre+=" | ";
          }
          let added = false;
          result = await connection.execute(
            `select * from watch_list where content_id=:content_id and profile_id=:profile_id`,
            {
              "content_id":req.body.content_id,
              "profile_id":req.body.profile_id
            }
          );
          if (result.rows.length>0) added = true;
          result = await connection.execute(
            `select actor_id from acted where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let cast = result.rows;
          result = await connection.execute(
            `select award_id,name aname,issued_by,TO_CHAR(received_date,'YYYY') year,null to_name,null to_id,null to_type
             from content_received JOIN awards USING(award_id) where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let awards = result.rows;
          console.log(result.rows);
          result = await connection.execute(
            `select award_id,awards.name aname,issued_by,TO_CHAR(received_date,'YYYY') year,actors.name to_name,actor_id to_id,'A' to_type
             from actor_received JOIN awards USING(award_id) JOIN actors USING(actor_id) where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          awards = awards.concat(result.rows);
          //console.log(result.rows);
          result = await connection.execute(
            `select award_id,awards.name aname,issued_by,TO_CHAR(received_date,'YYYY') year,directors.name to_name,director_id to_id,'D' to_type
             from director_received JOIN awards USING(award_id) JOIN directors USING(director_id) where content_id=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          awards = awards.concat(result.rows);
          //console.log(result.rows);
          result = await connection.execute(
            `select content_id2 content_id from similar_contents where content_id1=:content_id`,
            {
              "content_id":req.body.content_id
            }
          );
          let similar_contents=result.rows;
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"details":{"common":common,"info":info,"genre":genre,"added":added,"already_played":already_played,"release_date":release_date,"tv_network":tv_network,"awards":awards,"cast":cast,"seasons":seasons,"episodes":episodes,"similar_contents":similar_contents}});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getshortperson(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
            let name = "";
            let image = "";
            let character_name = "";
            console.log(req.body);
          if (req.body.person_type==="A") {
            result = await connection.execute(
              `select name,image from actors where actor_id=:actor_id`,
              {
                "actor_id":req.body.person_id
              }
            );
            name = result.rows[0].NAME;
            image = result.rows[0].IMAGE;
            result = await connection.execute(
              `select character_name from acted where actor_id=:actor_id and content_id=:content_id`,
              {
                "actor_id":req.body.person_id,
                "content_id":req.body.content_id
              }
            );
            character_name = result.rows[0].CHARACTER_NAME;
          }
          else if (req.body.person_type==="D") {
            result = await connection.execute(
              `select name,image from directors where director_id=:director_id`,
              {
                "director_id":req.body.person_id
              }
            );
            console.log(result.rows);
            name = result.rows[0].NAME;
            image = result.rows[0].IMAGE;
            character_name = "";
          }

          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"details":{"name":name,"image":image,"character_name":character_name}});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getgenre(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          let genre = [];
          result = await connection.execute(
            `select genre_id,name from genres
             MINUS
             select genre_id,name from preference JOIN genres USING(genre_id)
             where profile_id=:profile_id`,
            {
              "profile_id": req.body.profile_id
            }
          );
          genre = result.rows;
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"genre":genre});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function addtopreference(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          result = await connection.execute(
            `insert into preference values(:profile_id,:genre_id)`,
            {
              "profile_id": req.body.profile_id,
              "genre_id": req.body.genre_id
            }
          );
          result = await connection.execute(
            `commit`
          );
          let genre = [];
          result = await connection.execute(
            `select genre_id,name from genres
             MINUS
             select genre_id,name from preference JOIN genres USING(genre_id)
             where profile_id=:profile_id`,
            {
              "profile_id": req.body.profile_id
            }
          );
          genre = result.rows;
          console.log(genre);
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"genre":genre});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function removefrompreference(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          result = await connection.execute(
            `delete from preference where profile_id=:profile_id and genre_id=:genre_id`,
            {
              "profile_id": req.body.profile_id,
              "genre_id": req.body.genre_id
            }
          );
          result = await connection.execute(
            `commit`
          );
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getfullperson(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
            let common={};
            let contents = [];
            let awards = [];
          if (req.body.person_type==="A") {
            result = await connection.execute(
              `select actors.name pname,TO_CHAR(date_of_birth,'DD Mon, YYYY') date_of_birth,height/100 || 'm' height,description,image,cover_image,countries.name cname
               from actors JOIN countries USING(country_id) where actor_id=:actor_id`,
              {
                "actor_id":req.body.person_id
              }
            );
            common = result.rows[0];
            result = await connection.execute(
              `select content_id from acted where actor_id=:actor_id`,
              {
                "actor_id":req.body.person_id
              }
            );
            contents = result.rows;
            result = await connection.execute(
              `select award_id,awards.name aname,issued_by,TO_CHAR(received_date,'YYYY') year,contents.title to_name,content_id to_id,'C' to_type
               from actor_received JOIN awards USING(award_id) JOIN contents USING(content_id) where actor_id=:actor_id`,
              {
                "actor_id":req.body.person_id
              }
            );
            awards = result.rows;
          }
          else if (req.body.person_type==="D") {
            result = await connection.execute(
              `select directors.name pname,TO_CHAR(date_of_birth,'DD Mon, YYYY') date_of_birth,'' height,description,image,cover_image,countries.name cname
               from directors JOIN countries USING(country_id) where director_id=:director_id`,
              {
                "director_id":req.body.person_id
              }
            );
            common = result.rows[0];
            result = await connection.execute(
              `select content_id from contents where director_id=:director_id`,
              {
                "director_id":req.body.person_id
              }
            );
            contents = result.rows;
            result = await connection.execute(
              `select award_id,awards.name aname,issued_by,TO_CHAR(received_date,'YYYY') year,contents.title to_name,content_id to_id,'C' to_type
               from director_received JOIN awards USING(award_id) JOIN contents USING(content_id) where director_received.director_id=:director_id`,
              {
                "director_id":req.body.person_id
              }
            );
            awards = result.rows;
          }

          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"details":{"common":common,"contents":contents,"awards":awards}});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getrowcontent(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        result = await connection.execute(
          `select name from profiles where user_id=:user_id and profile_id=:profile_id`,
          {
            "user_id": user_id,
            "profile_id": req.body.profile_id
          }
        );
        if (result.rows.length>0) {
          let title = "";
          let contentList = [];
          if (req.body.space==="home") {
            if (req.body.query==="new release") {
              result = await connection.execute(
                `select content_id from movies
                 where release_date+30>=sysdate
                 UNION
                 select content_id from episodes
                 where release_date+30>=sysdate`
              );
              title = "New Release";
              contentList = result.rows.splice(0,15);
            }
            else if (req.body.query==="trending") {
              result = await connection.execute(
                `select content_id
                 from (select content_id,count(profile_id) val from watched_movies
                 where access_date+7>=sysdate
                 group by content_id
                 UNION
                 select content_id,count(profile_id) val
                 from (select distinct content_id,profile_id
                 from watched_episodes
                 where access_date+7>=sysdate)
                 group by content_id)
                 order by val desc`
              );
              title = "Trending Now";
              contentList = result.rows.splice(0,15);
            }
            else if (req.body.query==="preference") {
              result = await connection.execute(
                `select distinct content_id
                 from preference JOIN content_genre USING(genre_id)
                 where profile_id=:profile_id`,
                 {
                   "profile_id":req.body.profile_id
                 }
              );
              title = "Based on Preference";
              contentList = result.rows.splice(0,15);
            }
            else if (req.body.query==="continue") {
              result = await connection.execute(
                `select content_id
                 from watched_movies JOIN movies USING(content_id)
                 where profile_id=:profile_id and watched_movies.duration<movies.duration
                 UNION
                 select content_id
                 from (select distinct content_id
                 from watched_episodes
                 where profile_id=:profile_id)
                 where continue_tv_series(:profile_id,content_id)='YES'`,
                 {
                   "profile_id":req.body.profile_id
                 }
              );
              title = "Continue Watching";
              contentList = result.rows;
            }
            else if (req.body.query==="top country") {
              result = await connection.execute(
                `select country_id,countries.name cname from users JOIN countries USING(country_id)
                 where user_id=:user_id`,
                 {
                   "user_id":user_id
                 }
              );
              let country_id = result.rows[0].COUNTRY_ID;
              title =  result.rows[0].CNAME;
              result = await connection.execute(
                `select content_id
                 from (select content_id,count(profile_id) val
                 from watched_movies JOIN profiles USING(profile_id) JOIN users USING(user_id)
                 where access_date+7>=sysdate and country_id=:country_id
                 group by content_id
                 UNION
                 select content_id,count(profile_id) val
                 from (select distinct content_id,profile_id
                 from watched_episodes JOIN profiles USING(profile_id) JOIN users USING(user_id)
                 where access_date+7>=sysdate and country_id=:country_id)
                 group by content_id)
                 order by val desc`,
                 {
                   "country_id":country_id
                 }
              );
              contentList = result.rows.splice(0,10);
              title = "Top " + contentList.length + " in " + title;
            }
            else if (req.body.query==="top rated") {
              result = await connection.execute(
                `select content_id
                 from contents
                 order by rating desc`
              );
              title = "Top Rated";
              contentList = result.rows.splice(0,15);
            }
            else if (req.body.query.substr(0,5)==="genre") {
              result = await connection.execute(
                `select content_id from genres JOIN content_genre USING(genre_id)
                 where lower(name)=lower(:genre)`,
                 {
                   "genre":req.body.query.substr(5,req.body.query.length)
                 }
              );
              title = req.body.query.substr(5,req.body.query.length);
              contentList = result.rows.splice(0,15);
            }
          }
          else if (req.body.space==="movie") {
            if (req.body.query==="new release") {
              result = await connection.execute(
                `select content_id from movies
                 where release_date+30>=sysdate`
              );
              title = "New Release";
              contentList = result.rows.splice(0,15);
            }
            else if (req.body.query==="trending") {
              result = await connection.execute(
                `select content_id from watched_movies
                 where access_date+7>=sysdate
                 group by content_id
                 order by count(profile_id) desc`
              );
              title = "Trending Now";
              contentList = result.rows.splice(0,15);
            }
            else if (req.body.query==="preference") {
              result = await connection.execute(
                `select distinct content_id
                 from preference JOIN content_genre USING(genre_id) JOIN contents USING(content_id)
                 where profile_id=:profile_id and content_type='M'`,
                 {
                   "profile_id":req.body.profile_id
                 }
              );
              title = "Based on Preference";
              contentList = result.rows.splice(0,15);
            }
            else if (req.body.query==="continue") {
              result = await connection.execute(
                `select content_id
                 from watched_movies JOIN movies USING(content_id)
                 where profile_id=:profile_id and watched_movies.duration<movies.duration`,
                 {
                   "profile_id":req.body.profile_id
                 }
              );
              title = "Continue Watching";
              contentList = result.rows;
            }
            else if (req.body.query==="top country") {
              result = await connection.execute(
                `select country_id,countries.name cname from users JOIN countries USING(country_id)
                 where user_id=:user_id`,
                 {
                   "user_id":user_id
                 }
              );
              let country_id = result.rows[0].COUNTRY_ID;
              title = result.rows[0].CNAME;
              result = await connection.execute(
                `select content_id
                 from watched_movies JOIN profiles USING(profile_id) JOIN users USING(user_id)
                 where access_date+7>=sysdate and country_id=:country_id
                 group by content_id
                 order by count(profile_id) desc`,
                 {
                   "country_id":country_id
                 }
              );
              contentList = result.rows.splice(0,10);
              title = "Top " + contentList.length + " in " + title;
            }
            else if (req.body.query==="top rated") {
              result = await connection.execute(
                `select content_id
                 from contents
                 where content_type='M'
                 order by rating desc`
              );
              title = "Top Rated Movies";
              contentList = result.rows.splice(0,15);
            }
            else if (req.body.query.substr(0,5)==="genre") {
              result = await connection.execute(
                `select content_id from genres JOIN content_genre USING(genre_id) JOIN contents USING(content_id)
                 where lower(name)=lower(:genre) and content_type='M'`,
                 {
                   "genre":req.body.query.substr(5,req.body.query.length)
                 }
              );
              title = req.body.query.substr(5,req.body.query.length);
              contentList = result.rows.splice(0,15);
            }
          }
          else if (req.body.space==="tv") {
            if (req.body.query==="new release") {
              result = await connection.execute(
                `select distinct content_id from episodes
                where release_date+30>=sysdate`
              );
              title = "New Release";
              contentList = result.rows.splice(0,15);
            }
            else if (req.body.query==="trending") {
              result = await connection.execute(
                `select content_id
                 from (select distinct content_id,profile_id
                 from watched_episodes
                 where access_date+7>=sysdate)
                 group by content_id
                 order by count(profile_id) desc`
              );
              title = "Trending Now";
              contentList = result.rows.splice(0,15);
            }
            else if (req.body.query==="preference") {
              result = await connection.execute(
                `select distinct content_id
                 from preference JOIN content_genre USING(genre_id) JOIN contents USING(content_id)
                 where profile_id=:profile_id and content_type='T'`,
                 {
                   "profile_id":req.body.profile_id
                 }
              );
              title = "Based on Preference";
              contentList = result.rows.splice(0,15);
            }
            else if (req.body.query==="continue") {
              result = await connection.execute(
                `select content_id
                 from (select distinct content_id
                 from watched_episodes
                 where profile_id=:profile_id)
                 where continue_tv_series(:profile_id,content_id)='YES'`,
                 {
                   "profile_id":req.body.profile_id
                 }
              );
              title = "Continue Watching";
              contentList = result.rows;
            }
            else if (req.body.query==="top country") {
              result = await connection.execute(
                `select country_id,countries.name cname from users JOIN countries USING(country_id)
                 where user_id=:user_id`,
                 {
                   "user_id":user_id
                 }
              );
              let country_id = result.rows[0].COUNTRY_ID;
              title = result.rows[0].CNAME;
              result = await connection.execute(
                `select content_id
                 from (select distinct content_id,profile_id
                 from watched_episodes JOIN profiles USING(profile_id) JOIN users USING(user_id)
                 where access_date+7>=sysdate and country_id=:country_id)
                 group by content_id
                 order by count(profile_id) desc`,
                 {
                   "country_id":country_id
                 }
              );
              contentList = result.rows.splice(0,10);
              title = "Top " + contentList.length + " in " + title;
            }
            else if (req.body.query==="top rated") {
              result = await connection.execute(
                `select content_id
                 from contents
                 where content_type='T'
                 order by rating desc`
              );
              title = "Top Rated TV Series";
              contentList = result.rows.splice(0,15);
            }
            else if (req.body.query.substr(0,5)==="genre") {
              result = await connection.execute(
                `select content_id from genres JOIN content_genre USING(genre_id) JOIN contents USING(content_id)
                 where lower(name)=lower(:genre) and content_type='T'`,
                 {
                   "genre":req.body.query.substr(5,req.body.query.length)
                 }
              );
              title = req.body.query.substr(5,req.body.query.length);
              contentList = result.rows.splice(0,15);
            }
          }

          console.log(contentList);
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":true,"details":{"title":title,"contentList":contentList}});
        }
        else {
          res.send({"status":true, "subscriptionStatus":true, "profileStatus":false});
        }
      }
      else {
        res.send({"status":true, "subscriptionStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function authenticate(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select name from users where user_id=:user_id`,
        {
          "user_id": user_id
        }
      );
      let account_name = result.rows[0].NAME;
      result = await connection.execute(
        `select * from subscriptions
         where user_id=:user_id and
         end_date>=SYSDATE`,
        {
          "user_id": user_id
        }
      );
      if (result.rows.length>0) {
        res.send({"status":true,"accountname":account_name,"subscriptionStatus":true});
      }
      else {
        res.send({"status":true,"accountname":account_name,"subscriptionStatus":false});
      }

    }
    else {
      res.send({"status":false,"subscriptionStatus":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getprofile(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select name from users where user_id=:user_id`,
        {
          "user_id": user_id
        }
      );
      let account_name = result.rows[0].NAME;
      result = await connection.execute(
        `select profile_id,name from profiles where user_id=:user_id`,
        {
          "user_id": user_id
        }
      );
      res.send({"status":true,"accountname":account_name,"profile":result.rows});
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getaccountinfo(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select users.name name,email,TO_CHAR(date_of_birth,'YYYY-MM-DD') date_of_birth,gender,TO_CHAR(joining_date,'DD Mon, YYYY') joining_date,country_id
         from users
         where user_id=:user_id`,
        {
          "user_id": user_id
        }
      );
      let details = result.rows[0];
      console.log(details);
      result = await connection.execute(
        `select subscription_plan,TO_CHAR(end_date,'YYYY-MM-DD') expire_date from subscriptions
         where user_id=:user_id
         ORDER BY start_date DESC`,
        {
          "user_id": user_id
        }
      );
      let expire_date = "N/A";
      let subscription_plan = "Not subscribed";
      if (result.rows.length>0) {
        subscription_plan = result.rows[0].SUBSCRIPTION_PLAN;
        expire_date = result.rows[0].EXPIRE_DATE;
      }
      console.log(subscription_plan);
      result = await connection.execute(
        `select * from countries`
      );
      let country = result.rows;
      result = await connection.execute(
        `select profile_id,name from profiles where user_id=:user_id`,
        {
          "user_id": user_id
        }
      );
      res.send({"status":true,"all":{"details":details,"subscription_plan":subscription_plan,"expire_date":expire_date,"profile":result.rows,"country":country}});
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function submitaccountchange(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      let command = "update users set " + req.body.account_query + " where user_id = " + user_id;
      result = await connection.execute(
        command
      );
      await connection.execute(
        `COMMIT`
      );
      if (req.body.profile_query.length>0) {
        command = "update profiles set " + req.body.profile_query;
        result = await connection.execute(
          command
        );
        await connection.execute(
          `COMMIT`
        );
      }
      if (req.body.delete_profile.length>0) {
        command = "delete from profiles " + req.body.delete_profile;
        result = await connection.execute(
          command
        );
        await connection.execute(
          `COMMIT`
        );
      }
      result = await connection.execute(
        `select users.name name,email,TO_CHAR(date_of_birth,'YYYY-MM-DD') date_of_birth,gender,TO_CHAR(joining_date,'DD Mon, YYYY') joining_date,country_id
         from users
         where user_id=:user_id`,
        {
          "user_id": user_id
        }
      );
      let details = result.rows[0];
      console.log(details);
      result = await connection.execute(
        `select subscription_plan,TO_CHAR(end_date,'YYYY-MM-DD') expire_date from subscriptions
         where user_id=:user_id
         ORDER BY start_date DESC`,
        {
          "user_id": user_id
        }
      );
      let expire_date = "N/A";
      let subscription_plan = "Not subscribed";
      if (result.rows.length>0) {
        subscription_plan = result.rows[0].SUBSCRIPTION_PLAN;
        expire_date = result.rows[0].EXPIRE_DATE;
      }
      console.log(subscription_plan);
      result = await connection.execute(
        `select * from countries`
      );
      let country = result.rows;
      result = await connection.execute(
        `select profile_id,name from profiles where user_id=:user_id`,
        {
          "user_id": user_id
        }
      );
      res.send({"status":true,"changeStatus":true,"all":{"details":details,"subscription_plan":subscription_plan,"expire_date":expire_date,"profile":result.rows,"country":country}});
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
    res.send({"status":true,"changeStatus":false});
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}



async function verifyprofile(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select pin from profiles where user_id=:user_id
         and profile_id=:profile_id`,
        {
          "user_id": user_id,
          "profile_id": req.body.profile_id
        }
      );
      if (result.rows.length>0) {
        if (result.rows[0].PIN==req.body.pin) {
          res.send({"status":true,"profileStatus":true,"profile_id":req.body.profile_id});
        }
        else {
          res.send({"status":true,"profileStatus":false});
        }
      }
      else {
        res.send({"status":true,"profileStatus":false});
      }
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function createprofile(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select max(profile_id) profile_id from profiles`
      );
      let profile_id=(result.rows[0].PROFILE_ID==null?1:result.rows[0].PROFILE_ID+1);
      result = await connection.execute(
        `insert into profiles
         values(:profile_id,:name,:pin,:user_id)`,
        {
          "profile_id":profile_id,
          "name":req.body.name,
          "pin":req.body.pin,
          "user_id":user_id
        }
      );
      await connection.execute(
        `COMMIT`
      );
      res.send({"status":true,"profileStatus":true, "profile_id":profile_id});
    }
    else {
      res.send({"status":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function getcountry(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from countries`
    );
    console.log(result.rows);
    res.send({"country":result.rows});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}

async function purchase(req,res) {

  let connection;

  try {
    connection = await oracledb.getConnection( {
      user          : "c##netflix",
      password      : mypw,
      connectString : "localhost/ORCL"
    });
    let result = await connection.execute(
      `select * from sessions where session_id=:session_id`,
      {
        "session_id": req.headers.authorization
      }
    );
    if (result.rows.length>0) {
      let user_id = result.rows[0].USER_ID;
      result = await connection.execute(
        `select max(payment_id) payment_id from payments`
      );
      let payment_id=(result.rows[0].PAYMENT_ID==null?1:result.rows[0].PAYMENT_ID+1);
      let amount=0;
      if (req.body.subscriptionplan==='Basic') amount=4.99;
      else if (req.body.subscriptionplan==='Standard') amount=8.99;
      else if (req.body.subscriptionplan==='Premium') amount=12.99;
      result = await connection.execute(
        `INSERT INTO Payments
        VALUES(:payment_id,SYSDATE,:creditcardnumber,:amount,:user_id)`,
        { "payment_id":payment_id,
          "creditcardnumber":req.body.creditcardnumber,
          "amount":amount,
          "user_id":user_id
         }
      );
      await connection.execute(
        `COMMIT`
      );
      result = await connection.execute(
        `select max(subscription_id) subscription_id from subscriptions`
      );
      let subscription_id=(result.rows[0].SUBSCRIPTION_ID==null?1:result.rows[0].SUBSCRIPTION_ID+1);
      result = await connection.execute(
        `INSERT INTO Subscriptions
        VALUES(:subscription_id,:subscriptionplan,SYSDATE,ADD_MONTHS(SYSDATE,1),:user_id,:payment_id)`,
        { "subscription_id":subscription_id,
          "subscriptionplan":req.body.subscriptionplan,
          "user_id":user_id,
          "payment_id":payment_id
         }
      );
      await connection.execute(
        `COMMIT`
      );
      res.send({"status":true,"subscriptionStatus":true});
    }
    else {
      res.send({"status":false,"subscriptionStatus":false});
    }
    //res.send({"session_id":session_id});
  } catch (err) {
    console.error(err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error(err);
      }
    }
  }
}


app.post("/verify",function(req,res) {
  verify(req,res);
  //res.send({"session_id":session_id});
});

app.post("/adminverify",function(req,res) {
  adminverify(req,res);
  //res.send({"session_id":session_id});
});

app.post("/dashboardinfo",function(req,res) {
  dashboardinfo(req,res);
});

app.post("/addinfo",function(req,res) {
  addinfo(req,res);
});

app.post("/getinfo",function(req,res) {
  getinfo(req,res);
});

app.post("/editinfo",function(req,res) {
  editinfo(req,res);
});


app.post("/register",function(req,res) {
  register(req,res);
  //res.send({"session_id":session_id});
});

app.post("/verifyprofile",function(req,res) {
  verifyprofile(req,res);
  //res.send({"session_id":session_id});
});

app.post("/createprofile",function(req,res) {
  createprofile(req,res);
  //res.send({"session_id":session_id});
});

app.post("/submitaccountchange",function(req,res) {
  submitaccountchange(req,res);
  //res.send({"session_id":session_id});
});
/*
app.post("/submitprofilechange",function(req,res) {
  submitprofilechange(req,res);
  //res.send({"session_id":session_id});
});

app.post("/submitprofiledelete",function(req,res) {
  submitprofiledelete(req,res);
  //res.send({"session_id":session_id});
});
*/
app.post("/browseinfo",function(req,res) {
  browseinfo(req,res);
  //res.send({"session_id":session_id});
});

app.post("/purchase",function(req,res) {
  //console.log(req.body);
  purchase(req,res);
  //res.send({"session_id":session_id});
});

app.post("/getbannercontent",function(req,res) {
  getbannercontent(req,res);
});

app.post("/getshortcontent",function(req,res) {
  getshortcontent(req,res);
});

app.post("/getmylistcontent",function(req,res) {
  getmylistcontent(req,res);
});

app.post("/getsearchcontent",function(req,res) {
  getsearchcontent(req,res);
});

app.post("/getplayvideo",function(req,res) {
  getplayvideo(req,res);
});

app.post("/submitplayprogress",function(req,res) {
  submitplayprogress(req,res);
});

app.post("/checkreviewstatus",function(req,res) {
  checkreviewstatus(req,res);
});

app.post("/submitreview",function(req,res) {
  submitreview(req,res);
});

app.post("/changemylist",function(req,res) {
  changemylist(req,res);
});

app.post("/getshortperson",function(req,res) {
  getshortperson(req,res);
});

app.post("/getgenre",function(req,res) {
  getgenre(req,res);
});

app.post("/getfullperson",function(req,res) {
  getfullperson(req,res);
});

app.post("/addtopreference",function(req,res) {
  addtopreference(req,res);
});

app.post("/removefrompreference",function(req,res) {
  removefrompreference(req,res);
});

app.post("/getfullcontent",function(req,res) {
  getfullcontent(req,res);
});

app.post("/changemylistfull",function(req,res) {
  changemylistfull(req,res);
});

app.post("/getrowcontent",function(req,res) {
  getrowcontent(req,res);
});

app.get("/authenticate",function(req,res) {
  authenticate(req,res);
});

app.get("/getprofile",function(req,res) {
  getprofile(req,res);
});

app.get("/getaccountinfo",function(req,res) {
  getaccountinfo(req,res);
});

app.get("/getcountry",function(req,res) {
  getcountry(req,res);
});

app.get("/logout",function(req,res) {
  logout(req,res);
});

app.listen(3080,function() {
  console.log("Server running on port 3080");
});
