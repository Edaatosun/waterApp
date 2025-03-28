export class GoalModel{
    constructor(user_id,goal_id,amount,createdAt,resetAt,completed){
        this.user_id= user_id;
        this.goal_id = goal_id;
        this.amount=amount;
        this.createdAt= createdAt;
        this.resetAt= resetAt;
        this.completed= completed;
    }

}