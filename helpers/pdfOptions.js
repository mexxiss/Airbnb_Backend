export const options = {
    format: 'A3',
    orientation: 'portrait',
    border: {
        top: '2.54cm',
        bottom: '2.54cm',
        left: '1.91cm',
        right: '1.91cm',
    },
    header: {
        height: '15mm',
        contents: `
            <h4 style="color: red; font-size: 20px; font-weight: 800; text-align: center;">
                CUSTOMER INVOICE
            </h4>
        `,
    },
    footer: {
        height: '20mm',
        contents: {
            first: '<span style="color: blue; text-align: center;">Cover page</span>',
            2: '<span style="color: green; text-align: center;">Second page</span>',
            default: `
                <div style="text-align: center; color: #444;">
                    Page <span>{{page}}</span> of <span>{{pages}}</span>
                </div>
            `,
            last: '<span style="color: red; text-align: center;">Last Page</span>',
        },
    },
};
