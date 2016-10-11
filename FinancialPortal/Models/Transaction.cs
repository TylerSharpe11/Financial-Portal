namespace FinancialPortal.Models
{
    using System;
    using System.Collections.Generic;

    public partial class Transaction
    {
        public int Id { get; set; }

        public int AccountId { get; set; }
        public string Amount { get; set; }
        public string AbsAmount { get; set; }
        public string ReconciledAmount { get; set; }
        public string AbsReconiledAmount { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public DateTime? Updated { get; set; }

        public int? UpdatedByUserId { get; set; }

        public int CategoryId { get; set; }

        public virtual Account Account { get; set; }

        public virtual Category Category { get; set; }
    }
}
