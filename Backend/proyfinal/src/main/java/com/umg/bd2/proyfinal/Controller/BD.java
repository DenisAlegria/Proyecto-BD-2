package com.umg.bd2.proyfinal.Controller;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

class Request {
	public String user;
	public String password;
	public String sql;
}

class Response {
	public Response(String status, String error, List<Object> resultset) {
		this.status=status;
		this.error=error;
		this.resultset=resultset;
	}
	public String status;
	public String error;
	public List<Object> resultset;
}

@RestController
public class BD {

	public JSONArray ResultSetToJSON(ResultSet resultSet) {
		JSONArray result = new JSONArray();
		try {
			ResultSetMetaData md = resultSet.getMetaData();
			int numCols = md.getColumnCount();
			List<String> colNames = IntStream.range(0, numCols)
			  .mapToObj(i -> {
			      try {
			          return md.getColumnName(i + 1);
			      } catch (SQLException e) {
			          e.printStackTrace();
			          return "?";
			      }
			  })
			  .collect(Collectors.toList());
	
			
			while (resultSet.next()) {
			    JSONObject row = new JSONObject();
			    colNames.forEach(cn -> {
			        try {
			            row.put(cn, resultSet.getObject(cn));
			        } catch (JSONException | SQLException e) {
			            e.printStackTrace();
			        }
			    });
			    result.put(row);
		}
		} catch(Exception ex) {
			System.out.println(ex);
		}
		return result;
	}
	
	public String dbUrl() {

		return "jdbc:mysql://proy-final-bd2.c4pj0q0xq7tj.us-east-1.rds.amazonaws.com:3306/testdb?allowMultiQueries=true";
	}

	@CrossOrigin
	@PostMapping(value="/login")
	public Response login(@RequestBody Request query) {
		String rsString="";
		try {
			Class.forName("com.mysql.cj.jdbc.Driver"); 
			DriverManager.getConnection(dbUrl(),query.user, query.password);
			//rsString=SucessToJSON();
		} catch (Exception ex) {
			//String error=errorToJSON(ex);
			System.out.println("Log: "+ex.getMessage());
			return new Response("error",ex.getMessage(),null);
		}
		System.out.println("Log"+rsString);
		return new Response("Sucessfull","",null);
	}
	
	@CrossOrigin
	@PostMapping(value="/execute")
	public Response execute(@RequestBody Request query) {
		JSONArray rs=null;
		try {
			System.out.println("Log "+ query.sql);
			Class.forName("com.mysql.cj.jdbc.Driver"); 
			Connection con = DriverManager.getConnection(dbUrl(),query.user,query.password);
			Statement  stmt = con.createStatement();
			boolean result = stmt.execute(query.sql);
			if (result) rs = ResultSetToJSON(stmt.getResultSet());
			stmt.close();
		} catch (Exception ex) {
			System.out.println("Log: "+ex.getMessage());
			return new Response("error",ex.getMessage(),null);
		}
		if (rs!=null)
			System.out.println("Log: "+rs.toString());
		return new Response("Sucessfull","",rs.toList());
	}
}
