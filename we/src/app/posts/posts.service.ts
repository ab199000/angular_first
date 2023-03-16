import { Post } from "./post.model";
import {Injectable} from '@angular/core'
import { Subject } from 'rxjs'
import {HttpClient} from '@angular/common/http'


@Injectable({providedIn: 'root'})
export class PostService{
    post:any
    private posts: Post[] = []
    private postsUpdated = new Subject<Post[]>()
    postsServer: any
    myData:any

    constructor(private http:HttpClient){}

    getPosts(){
        return [...this.posts]
    }

    getPostUpdateListener(){
        return this.postsUpdated.asObservable()
    }

    addPost(title: string, content: string,img:any){
      console.log(img)
      let formData = new FormData();
      formData.append('title',title)
      formData.append('content',content)
      formData.append('file',img)

      this.http.post('http://localhost:3000/posts/addPost',
      formData
      ).subscribe((res)=>{

      console.log(res)

      this.post = res

      this.getDan()
      setTimeout(()=>{
        console.log(this.postsServer);
        // this.posts.push(this.postsServer[this.postsServer.length-1])
        this.postsUpdated.next([...this.posts])
      }, 200)

      
    })
    }


    deletePost(index:number){
      const id1 = this.posts[index]._id
      this.posts = this.posts.filter(function(_,i){
          return index !=i
      })
      this.http.delete(`http://localhost:3000/posts/deletePost/${id1}`).subscribe((res)=>{
        console.log(res);

      })

      this.postsUpdated.next([...this.posts])
    }

    editPost(index:number,title:string,content:string,img:any){
      const id = this.posts[index]._id
      let formData = new FormData();
      formData.append('id',`${id}`)
      formData.append('title',title)
      formData.append('content',content)
      formData.append('file',img)

      this.http.put("http://localhost:3000/posts/editPost",formData).subscribe((res)=>{
        if(res){
          this.posts[index] = {_id:id,title:title, content:content,isEdited:false,img:img}
          console.log(this.posts);

          this.postsUpdated.next([...this.posts])
        }
      })


    }

    getDan(){
      this.http.get('http://localhost:3000/posts/getPosts').subscribe((data)=>{
        this.postsServer = data
        this.posts = this.postsServer
        console.log(this.postsServer);
      })
      return this.http.get('http://localhost:3000/posts/getPosts')
    }
}
