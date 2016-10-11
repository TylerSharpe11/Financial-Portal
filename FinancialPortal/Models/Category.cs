namespace FinancialPortal.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Security.Categories")]
    public partial class Category
    {
        public Category()
        {
            BudgetItems = new HashSet<BudgetItem>();
            Transactions = new HashSet<Transaction>();
        }

        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int Id { get; set; }

        public Guid Household { get; set; }

        [StringLength(50)]
        public string Name { get; set; }

        public virtual ICollection<BudgetItem> BudgetItems { get; set; }

        public virtual ICollection<Transaction> Transactions { get; set; }
    }
}
