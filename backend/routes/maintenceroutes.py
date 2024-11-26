from controllers.maintencecontroller import get_all_Service_Orders 
from controllers.maintencecontroller import get_jobs_by_id
from controllers.maintencecontroller import edit_job_details
from controllers.maintencecontroller import start_job
from controllers.maintencecontroller import finish_job


def maintence(app):
    app.route('/allserviceorders', methods=['GET'])(get_all_Service_Orders)
    app.route('/jobsbyid/<int:id_tecnico>', methods=['GET'])(get_jobs_by_id)
    app.route('/editjobdetails/<int:id_manutencao>', methods=['PUT'])(edit_job_details)
    app.route('/startjob/<int:id_manutencao>', methods=['PUT'])(start_job)
    app.route('/finishjob/<int:id_manutencao>', methods=['PUT'])(finish_job)