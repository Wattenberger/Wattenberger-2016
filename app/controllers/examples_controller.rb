class ExamplesController < ApplicationController
  # GET /examples
  # GET /examples.json
  def index
    @examples = Example.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @examples }
    end
  end

  # GET /examples/1
  # GET /examples/1.json
  def show
    @example = Example.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @example }
    end
  end

  # GET /examples/new
  # GET /examples/new.json
  def new
    @example = Example.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @example }
    end
  end

  # GET /examples/1/edit
  def edit
    @example = Example.find(params[:id])
  end

  # POST /examples
  # POST /examples.json
  def create
    @example = Example.new(params[:example])

    respond_to do |format|
      if @example.save
        format.html { redirect_to @example, notice: 'Example was successfully created.' }
        format.json { render json: @example, status: :created, location: @example }
      else
        format.html { render action: "new" }
        format.json { render json: @example.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /examples/1
  # PUT /examples/1.json
  def update
    @example = Example.find(params[:id])

    respond_to do |format|
      if @example.update_attributes(params[:example])
        format.html { redirect_to @example, notice: 'Example was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @example.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /examples/1
  # DELETE /examples/1.json
  def destroy
    @example = Example.find(params[:id])
    @example.destroy

    respond_to do |format|
      format.html { redirect_to examples_url }
      format.json { head :no_content }
    end
  end
end
