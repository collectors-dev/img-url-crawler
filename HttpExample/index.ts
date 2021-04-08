import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { imgListParser } from './crawler';


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    try {
        context.log('HTTP trigger function processed a request.');
        const targetUrl = req.query?.targetUrl;
        if (!targetUrl) {
            context.res = {
                body: "'targetUrl' query parameter is required."
            }
        } else {
            const imageList = await imgListParser(context, targetUrl);
    
            context.res = {
                // status: 200, /* Defaults to 200 */
                body: JSON.stringify(imageList, null, 2)
            };
        }
    } catch (e) {
        context.log('Error!!!');
        context.log(e);
        context.res = {
            body: e
        }
    }
    context.log('Process completed.');
};

export default httpTrigger;