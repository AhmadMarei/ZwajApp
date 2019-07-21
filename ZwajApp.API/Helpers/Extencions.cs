using System;
using Microsoft.AspNetCore.Http;

namespace ZwajApp.API.Helpers
{
    public static class Extencions
    {
        public static void addApplicationError(this HttpResponse response,string message){
            response.Headers.Add("Application-Error",message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");

        }
                public static int CalculatAge(this DateTime date){
                  var age =DateTime.Today.Year- date.Year;
                  if(date.AddYears(age)>DateTime.Today) age--;
                  return age;

        }
    }
}
