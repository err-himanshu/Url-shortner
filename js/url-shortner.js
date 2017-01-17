
/*
  A light weight url shorten script with taffydb
  @author - Himanshu Gupta
  @date - Jan 17, 2017
*/
var url_database;
//function to load script
function loadScript( url, callback ) {
  var script = document.createElement( "script" )
  script.type = "text/javascript";
  if(script.readyState) {  //IE
    script.onreadystatechange = function() {
      if ( script.readyState === "loaded" || script.readyState === "complete" ) {
        script.onreadystatechange = null;
        callback();
      }
    };
  } else {  //Others
    script.onload = function() {
      callback();
    };
  }
  script.src = url;
  document.getElementsByTagName( "head" )[0].appendChild( script );
}


// call the function taffyDb once script loaded
//This ensure that script has been loaded
loadScript("js/taffyDb.js", function() {
  //intialize taffy database
   url_database = TAFFY();
});
//function to encode url
function shortenUrl(url){

  var result = {};
  //check if provided url is valid or not
  if(ValidateURL(url)){
      //check for url length
      var urlLength = url.length
      if(urlLength > 0 && urlLength < 25){
        //generate 6 digit url based on length
          var generatedString = generateUrlString(url,7)
      }else{
          var generatedString = generateUrlString(url,8)
      }
    //check if generate string is already there then recursively call the same function else perform
    if(url_database({encoded_url:generatedString}).count() === 0){
      // if name found in database then update else create a new one
          if(url_database({url_name:url}).count() === 0){
            //insert record in database
            result =url_database.insert({url_name:url, encoded_url:generatedString,date_created: Date(), date_updated: Date()});
          }else{
              result = url_database({url_name:url}).update({encoded_url:generatedString, date_updated: Date()});
          }
          result.success = true;
          result.message = "Encoded successfully";
          result.url = url;
          result.encodedUrl = generatedString;
          return result;
    }else{
      return shortenUrl(url);
    }
  }else{
    result.success = false;
    result.message = "Please provide a valid url"
    return result
  }
}
//function to decode url
function deshortenUrl(_url){
  //check if url is already encoded and present in database
  var result = {};
  if(url_database({encoded_url:_url}).count() === 0){
    result.success = false;
    result.message = "This url is not present in database"
  }else{
      result = url_database({encoded_url:_url}).get();
  }
  return result;
}
//function to generate random string based on url
function generateUrlString(text, length){
      var text = "";
      var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.!#$&";
      for( var i=0; i < length; i++ )
          text += possible.charAt(Math.floor(Math.random() * possible.length));

      return text;
}

//function to validate url
function ValidateURL(str) {
  var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
  if(!regex .test(str)) {
    return false;
  } else {
    return true;
  }
}
