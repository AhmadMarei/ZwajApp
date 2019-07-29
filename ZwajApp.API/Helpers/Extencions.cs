using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ZwajApp.API.Helpers
{
	public static class Extencions
	{
		public static void addApplicationError(this HttpResponse response, string message)
		{
			response.Headers.Add("Application-Error", message);
			response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
			response.Headers.Add("Access-Control-Allow-Origin", "*");

		}
		public static int CalculatAge(this DateTime date)
		{
			var age = DateTime.Today.Year - date.Year;
			if (date.AddYears(age) > DateTime.Today) age--;
			return age;

		}

		public static void addPagination(this HttpResponse response, int currentPage,int itemsPerPage,
        int totalItems,int totalPages)
		{
            var paginationHeader=new PaginationHeader(currentPage,itemsPerPage,totalItems,totalPages);
            var camelCaseFormatter= new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver= new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination",JsonConvert.SerializeObject(paginationHeader,camelCaseFormatter));
			response.Headers.Add("Access-Control-Expose-Headers", "Pagination");

		}
	}
}
