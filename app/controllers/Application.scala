package controllers

import play.api._
import play.api.data.Form
import play.api.data.Forms._
import play.api.mvc._
import play.api.db._
import anorm._
import anorm.SqlParser._ 
import play.api.Play.current

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
  }

  def debug = Action {
    Ok(views.html.index("debug"))
  }

  case class Result(beer: Int, awa: Int)

  val form = Form(mapping("beer" -> number, "awa" -> number)(Result.apply)(Result.unapply))

  def input = Action { implicit request =>
    val result = form.bindFromRequest.get
    val beer_diff = result.beer - 700
    val awa_diff = result.awa - 300
    val score = 1000 - beer_diff.abs - awa_diff.abs
 
    DB.withConnection { implicit c =>
      val count = SQL(
        """
          insert into beer(beer,awa,score)
          values({beer},{awa},{score})
        """
      ).on(
        'beer -> result.beer,
        'awa -> result.awa,
        'score -> score).executeInsert()
      println("exec!")
    }

    Ok(views.html.index(result.toString))
  }

  def rank_view = Action { implicit request =>
    val result = DB.withConnection { implicit c =>
      SQL("select * from beer order by 'score'").as( int("beer") ~ int("awa") ~int("score") map(flatten) * )
    }

    Ok(views.html.view(result))
  }


}
