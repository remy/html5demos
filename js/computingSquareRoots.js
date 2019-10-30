onmessage=function(event) {
          if ( event.data  =="hello") {
               postMessage("I'm here !");  
          }
         else {  
              obj=JSON.parse(event.data);    
              rep={  id  : obj.id , line :  obj.line.map(Math.sqrt)  }    
              postMessage(JSON.stringify(rep) ); 
              close();
         }
}
