import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/interfaces/interface.user';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit ,AfterViewInit,OnDestroy{

  private page:number=0;
  private itemPrePage:number=10; 
  public userId!:string|number;
  public user?:IUser;
  public friends:IUser[]=[];
  private friendsId=[]
  private elementCards:any;
  private controler:boolean=false;
  private windowHeight:number=0;


  @ViewChild("cards",{static:false}) "cardsRef":ElementRef;

  constructor(
    private http:HttpClient,
    private router: Router,
    private ActivatedRoute: ActivatedRoute,
    private userService: UserService
  ) { }

 private subscription:Subscription=new Subscription();

  

  ngOnInit(): void {  
    this.windowHeight=window.innerHeight;
      this.ActivatedRoute.params.subscribe(params => {
      this.userId=params['id'];
    })  
    this.getUserAndFriends(this.userId);    
    
  }

  ngAfterViewInit(): void {
    this.elementCards=this.cardsRef.nativeElement
  }
    

getUserAndFriends(id:string|number):void{
  this.subscription.add(
    this.userService.getById(id)
    .subscribe({
      next:(user)=>{
        this.user=user;
        this.friendsId=this.arrayToArrayofArrays(this.user.friendsId,this.itemPrePage); 
        if(this.user?.friendsId) this.getFriends(this.friendsId[this.page])
      },
      error:(err)=>alert(err.statusText+"error from details.component Line:49")
    })
  )
}

getFriends(id:number[]|string[]):void{
this.subscription.add(
    this.userService.getByIds(id).subscribe({
      next: data=>{
        let frisnds=data.map(f=>f)
        this.friends=[...this.friends,...frisnds]; 
        this.controler=!this.controler;    
      },
      error: (err)=>console.log(err+"error from details.component Line:49")
      
    })
)
}



// this function turns array fo numbers into array of arrayof numbers  for example: [1,2,3,4] to [[1,2],[3,4]] 
 
 arrayToArrayofArrays(arr:any,n:number):any{
      let result=[];
      for(let i=0; i<arr.length; i++){
        let smallArray=[];
        for(let j=0; j<n; j++){
          let num=arr[i+j];
          if(num) smallArray.push(num)          
        }
        i+=n-1;    
        result.push(smallArray)
      }
    return result
   }


   @HostListener('window:scroll', ['$event'])
    onScroll(event: any) { 
      if(this.elementCards.getBoundingClientRect().y+this.elementCards.getBoundingClientRect().height-100<=this.windowHeight&&this.controler){                
        this.page+=1;
        this.controler=!this.controler;
        if(this.user?.friendsId) this.getFriends(this.friendsId[this.page])    
      } 
    }

    details(id: string|number) {
          this.userId=id; 
          this.page=0;
          this.user=undefined;       
          this.friends=[]
          this.friendsId=[]
          this.controler=false;
          this.getUserAndFriends(this.userId);    
      }

      
  
ngOnDestroy(): void {
  this.subscription.unsubscribe();
}
}
