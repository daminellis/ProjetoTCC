from controllers.maintencecontroller import get_all_Service_Orders 

def maintence(app):
    app.route('/allserviceorders', methods=['GET'])(get_all_Service_Orders)