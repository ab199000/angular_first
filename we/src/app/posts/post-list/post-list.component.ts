import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { Post } from "../post.model";
import { PostService } from "../posts.service";

@Component({
    selector: 'app-post-list',
    templateUrl: './post-list.component.html',
    styleUrls:['./post-list.component.css']
})
export class PostListComponent implements OnInit{
    // posts = [
    //     {title: 'First Post',content:'This 1'},
    //     {title: 'Second Post',content:'This 2'},
    //     {title: 'Third Post',content:'This 3'},
    // ]
    newTitle = ""
    newContent = ""
    myData:any
    posts:Post[] = []
    newImg:any
    // private postsSub: Subscription

    constructor(public postService: PostService){}

    ngOnInit(){
      this.postService.getDan().subscribe((data)=>{
        this.myData = data
        this.posts = this.myData
        console.log(this.posts);

      })

      this.postService.getPostUpdateListener()
        .subscribe((posts:Post[])=>{
          this.posts = posts
        })
    }

    onDeletePost(i:number){
        this.postService.deletePost(i)
    }

    onEdit(id:number){
      console.log(this.newImg,"onEdit")
        this.postService.editPost(id,this.newTitle,this.newContent,this.newImg)
    }
    onOpenEdit(id:number){
        this.newTitle = this.posts[id].title
        this.newContent = this.posts[id].content
        this.newImg = this.posts[id].img
        console.log(this.newImg)
        if(this.posts[id].isEdited){
            this.posts[id].isEdited = false
        }else this.posts[id].isEdited = true
      }

      chooseFile(e: any){
        this.newImg = e.target.files[0]
        console.log(this.newImg,123)
      }
}
