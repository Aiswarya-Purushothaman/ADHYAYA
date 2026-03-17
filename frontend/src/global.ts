export{}


declare global{
  interface Window{
google:{
  accounts:{
    id:{_jd: any
      initialize:(options:{client_id:string,callback:(response:any)=>void})=>void;
      renderButton:(element:HTMLElement|null,options:{theme:string,size:string})=>void
      prompt:()=>void
    }
  }
}
  }
}