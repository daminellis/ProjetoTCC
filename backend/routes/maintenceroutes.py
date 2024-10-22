from controllers.maintencecontroller import get_all_Service_Orders 
from controllers.maintencecontroller import get_jobs_by_id

def maintence(app):
    app.route('/allserviceorders', methods=['GET'])(get_all_Service_Orders)
    app.route('/jobsbyid/<int:id_tecnico>', methods=['GET'])(get_jobs_by_id)