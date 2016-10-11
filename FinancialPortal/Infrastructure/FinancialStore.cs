//using System;
//using System.Collections.Generic;
//using System.Security.Claims;
//using System.Threading.Tasks;
//using FinancialPortal.DataAccess;
//using FinancialPortal.Models;
//using System.Linq;
//using Microsoft.AspNet.Identity;

//namespace FinancialPortal.Infrastructure
//{
//    public class FinancialStore 

//    {
//        private readonly FPDataAccess _dataAccess;

//        public FinancialStore(FPDataAccess dataAccess)
//        {
//            _dataAccess = dataAccess;
//        }


//        public Task InsertAccountAsync(Account a)
//        {
//            return _dataAccess.InsertAccountAsync(a);
//        }

//        public async Task<Account> GetAccountsByHouseholdAsync(Guid h)
//        {
//            var account = await _dataAccess.GetAccountsByHouseholdAsync(h);
//            return account;
//        }

//    }
//}