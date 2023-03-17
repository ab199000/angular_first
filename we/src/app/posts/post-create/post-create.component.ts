import { Component} from "@angular/core";
import { NgForm } from "@angular/forms";

import { PostService } from "../posts.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {

    constructor(public postService: PostService){}

    searchImg: any = "";

    chooseFile(e: any){
      this.searchImg = e.target.files[0]
    }

    onAddPost(form: NgForm) {
        if(form.invalid){
            return
        }
        console.log(form)
        console.log(this.searchImg)
        this.postService.addPost(form.value.title,form.value.content,this.searchImg)
        form.resetForm()
    }

}
