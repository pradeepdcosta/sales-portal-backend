const PDFDocument = require('pdfkit');
const { User, Account, AccountSection } = require('../models');

const pdfController = {
    async generatePDF(req, res) {
        try {
            const userId = req.user.id;
    
            // Get user's account
            const user = await User.findByPk(userId, {
                include: [{
                    model: Account,
                    as: 'managedAccounts',
                    through: 'UserAccounts'
                }]
            });
    
            if (!user.managedAccounts || user.managedAccounts.length === 0) {
                return res.status(404).json({ success: false, message: 'No accounts found' });
            }
    
            const accountId = user.managedAccounts[0].id;
    
            // Get all sections for this account
            const sections = await AccountSection.findAll({
                where: { accountId },
                order: [['sectionType', 'ASC']]
            });
    
            // Create PDF document
            const doc = new PDFDocument({ margin: 50 });
    
            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=account-plan.pdf');
    
            // Pipe the PDF to the response
            doc.pipe(res);
    
            // Add title
            doc.fontSize(24)
               .text('Account Development Plan', { align: 'center' })
               .moveDown(2);
    
            // Add each section
            for (const section of sections) {
                const content = section.content;
                
                // Section header
                doc.fontSize(18)
                   .fillColor('#cc0000')
                   .text(formatSectionTitle(section.sectionType))
                   .moveDown(1);
    
                // Section content
                doc.fontSize(12)
                   .fillColor('#000000');
    
                // Format and add content based on section type
                if (content) {
                    Object.entries(content).forEach(([key, value]) => {
                        if (value) {
                            doc.fontSize(14)
                               .fillColor('#333333')
                               .text(formatFieldName(key))
                               .moveDown(0.5);
    
                            doc.fontSize(12)
                               .fillColor('#000000')
                               .text(value)
                               .moveDown(1);
                        }
                    });
                }
    
                doc.moveDown(2);
                
                // Add page break between sections
                if (sections.indexOf(section) < sections.length - 1) {
                    doc.addPage();
                }
            }
    
            // Finalize the PDF
            doc.end();
    
        } catch (error) {
            console.error('Error generating PDF:', error);
            res.status(500).json({ success: false, message: 'Error generating PDF' });
        }
    }
};

// Helper function to format section titles
function formatSectionTitle(sectionType) {
    const titles = {
        'executive_summary': '01 Executive Summary',
        'customer_overview': '02 Customer Overview',
        'account_overview': '03 Account Overview',
        'relationship_map': '04 Relationship Map'
    };
    return titles[sectionType] || sectionType;
}

// Helper function to format field names
function formatFieldName(fieldName) {
    return fieldName
        .split(/(?=[A-Z])|_/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

module.exports = pdfController; 