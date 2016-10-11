namespace FinancialPortal.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Insight_SchemaRegistry
    {
        [Required]
        [StringLength(64)]
        public string SchemaGroup { get; set; }

        [Key]
        [StringLength(256)]
        public string ObjectName { get; set; }

        [Required]
        [StringLength(28)]
        public string Signature { get; set; }

        [Required]
        [StringLength(32)]
        public string Type { get; set; }

        public int? OriginalOrder { get; set; }
    }
}
